import fs from "node:fs/promises";
import path from "node:path";
import { PageDocument, PageSummary, SiteContentIndex } from "../types/content";
import { badRequest, notFound } from "../utils/errors";
import { validateContentId, validatePageDocument, validateSiteContentIndex } from "../validation/contentValidation";
import { settingsPath, siteDir } from "./paths";
import { writeAuditEvent } from "./auditLog";

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function writeFileAtomic(file: string, content: string): Promise<void> {
  const tmp = `${file}.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await fs.writeFile(tmp, content, "utf8");
  await fs.rename(tmp, file);
}

function contentPaths(siteIdInput: string): { siteId: string; dir: string; indexFile: string; pagesDir: string; backupsDir: string } {
  const { siteId, dir } = siteDir(siteIdInput);
  return {
    siteId,
    dir,
    indexFile: path.join(dir, "site-content.json"),
    pagesDir: path.join(dir, "pages"),
    backupsDir: path.join(dir, "backups", "pages")
  };
}

function pageFile(siteIdInput: string, pageIdInput: string): { siteId: string; pageId: string; file: string } {
  const paths = contentPaths(siteIdInput);
  const pageId = validateContentId(pageIdInput, "pageId");
  const file = path.join(paths.pagesDir, `${pageId}.json`);
  const relative = path.relative(paths.pagesDir, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw badRequest("Unsafe page path resolved outside page storage.");
  }
  return { siteId: paths.siteId, pageId, file };
}

async function ensureSiteExists(siteId: string): Promise<void> {
  const { file } = settingsPath(siteId);
  if (!(await exists(file))) throw notFound("Site settings not found.");
}

async function readIndex(siteId: string): Promise<SiteContentIndex> {
  const paths = contentPaths(siteId);
  if (!(await exists(paths.indexFile))) {
    await createDefaultPagesForSite(siteId);
  }
  const parsed = JSON.parse(await fs.readFile(paths.indexFile, "utf8")) as unknown;
  return validateSiteContentIndex(parsed);
}

async function writeIndex(siteId: string, index: SiteContentIndex): Promise<void> {
  const paths = contentPaths(siteId);
  await fs.mkdir(paths.dir, { recursive: true });
  await writeFileAtomic(paths.indexFile, stableJson(validateSiteContentIndex(index)));
}

function starterHomePage(siteId: string, siteName = "Demo Site", timestamp = new Date().toISOString()): PageDocument {
  return {
    schemaVersion: 1,
    pageId: "home",
    title: "Home",
    slug: "home",
    seo: {
      title: `${siteName} | Home`,
      description: "Starter homepage generated for the SloanSites builder content model."
    },
    status: "published",
    createdAt: timestamp,
    updatedAt: timestamp,
    navigation: {
      label: "Home",
      order: 0,
      showInNavigation: true
    },
    sectionOrder: ["hero-section", "services-section", "contact-section"],
    sections: [
      {
        sectionId: "hero-section",
        type: "hero",
        displayName: "Hero",
        locked: false,
        hidden: false,
        stylePreset: "soft",
        layoutPreset: "split",
        spacingPreset: "spacious",
        background: "soft",
        blockOrder: ["hero-heading", "hero-text", "hero-button"],
        blocks: [
          {
            blockId: "hero-heading",
            type: "heading",
            label: "Hero heading",
            content: { text: `Welcome to ${siteName}` },
            hidden: false,
            locked: false,
            validation: { status: "valid", messages: [] },
            style: { level: 1 }
          },
          {
            blockId: "hero-text",
            type: "text",
            label: "Hero copy",
            content: { text: "A minimal starter page for editable SloanSites content." },
            hidden: false,
            locked: false,
            validation: { status: "valid", messages: [] },
            style: {}
          },
          {
            blockId: "hero-button",
            type: "button",
            label: "Primary action",
            content: { text: "Request a quote" },
            hidden: false,
            locked: false,
            validation: { status: "valid", messages: [] },
            style: { variant: "primary" },
            link: { href: "#contact", label: "Request a quote", target: "_self" }
          }
        ]
      },
      {
        sectionId: "services-section",
        type: "services",
        displayName: "Services",
        locked: false,
        hidden: false,
        stylePreset: "plain",
        layoutPreset: "grid",
        spacingPreset: "comfortable",
        background: "default",
        blockOrder: ["services-heading", "service-card"],
        blocks: [
          {
            blockId: "services-heading",
            type: "heading",
            label: "Services heading",
            content: { text: "Services built around local customers" },
            hidden: false,
            locked: false,
            validation: { status: "valid", messages: [] },
            style: { level: 2 }
          },
          {
            blockId: "service-card",
            type: "card",
            label: "Service card",
            content: { title: "Priority appointments", text: "Starter card content for the builder." },
            hidden: false,
            locked: false,
            validation: { status: "valid", messages: [] },
            style: { variant: "service" }
          }
        ]
      },
      {
        sectionId: "contact-section",
        type: "contact",
        displayName: "Contact",
        locked: false,
        hidden: false,
        stylePreset: "soft",
        layoutPreset: "single",
        spacingPreset: "comfortable",
        background: "surface",
        blockOrder: ["contact-heading", "contact-form"],
        blocks: [
          {
            blockId: "contact-heading",
            type: "heading",
            label: "Contact heading",
            content: { text: "Ready to get started?" },
            hidden: false,
            locked: false,
            validation: { status: "valid", messages: [] },
            style: { level: 2 }
          },
          {
            blockId: "contact-form",
            type: "form-placeholder",
            label: "Contact form placeholder",
            content: { text: "Contact form integration placeholder." },
            hidden: false,
            locked: false,
            validation: { status: "valid", messages: [] },
            style: {}
          }
        ]
      }
    ],
    metadata: {}
  };
}

export async function createDefaultPagesForSite(siteIdInput: string, siteName?: string): Promise<void> {
  const { siteId, indexFile, pagesDir } = contentPaths(siteIdInput);
  await ensureSiteExists(siteId);
  await fs.mkdir(pagesDir, { recursive: true });
  const now = new Date().toISOString();
  const home = validatePageDocument(starterHomePage(siteId, siteName, now));
  const homeFile = path.join(pagesDir, "home.json");
  if (!(await exists(homeFile))) {
    await writeFileAtomic(homeFile, stableJson(home));
  }
  if (!(await exists(indexFile))) {
    await writeIndex(siteId, {
      schemaVersion: 1,
      siteId,
      defaultPageId: "home",
      pageOrder: ["home"],
      publishedStatus: "published",
      createdAt: now,
      updatedAt: now
    });
  }
}

async function backupPage(siteId: string, pageId: string, sourceFile: string): Promise<void> {
  if (!(await exists(sourceFile))) return;
  const paths = contentPaths(siteId);
  await fs.mkdir(paths.backupsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await fs.copyFile(sourceFile, path.join(paths.backupsDir, `${pageId}.${stamp}.json`));
  const backups = (await fs.readdir(paths.backupsDir)).filter((name) => name.startsWith(`${pageId}.`) && name.endsWith(".json")).sort();
  const excess = backups.slice(0, Math.max(0, backups.length - 10));
  await Promise.all(excess.map((name) => fs.rm(path.join(paths.backupsDir, name), { force: true })));
  await writeAuditEvent({ action: "backup.created", result: "success", siteId, metadata: { kind: "page", pageId } });
}

function pageSummary(page: PageDocument): PageSummary {
  return {
    pageId: page.pageId,
    title: page.title,
    slug: page.slug,
    status: page.status,
    updatedAt: page.updatedAt,
    order: page.navigation.order,
    showInNavigation: page.navigation.showInNavigation
  };
}

export async function listPages(siteIdInput: string): Promise<{ index: SiteContentIndex; pages: PageSummary[] }> {
  const { siteId, pagesDir } = contentPaths(siteIdInput);
  await createDefaultPagesForSite(siteId);
  const index = await readIndex(siteId);
  const files = (await fs.readdir(pagesDir)).filter((name) => name.endsWith(".json"));
  const pages = [];
  for (const file of files) {
    const page = validatePageDocument(JSON.parse(await fs.readFile(path.join(pagesDir, file), "utf8")) as unknown);
    pages.push(pageSummary(page));
  }
  pages.sort((a, b) => {
    const aIndex = index.pageOrder.indexOf(a.pageId);
    const bIndex = index.pageOrder.indexOf(b.pageId);
    return (aIndex === -1 ? a.order : aIndex) - (bIndex === -1 ? b.order : bIndex);
  });
  return { index, pages };
}

export async function readPage(siteIdInput: string, pageIdInput: string): Promise<PageDocument> {
  const { siteId, pageId, file } = pageFile(siteIdInput, pageIdInput);
  await createDefaultPagesForSite(siteId);
  if (!(await exists(file))) throw notFound("Page not found.");
  const page = validatePageDocument(JSON.parse(await fs.readFile(file, "utf8")) as unknown);
  if (page.pageId !== pageId) throw badRequest("Page ID does not match file name.");
  return page;
}

export async function createPage(siteIdInput: string, input: unknown): Promise<PageDocument> {
  const paths = contentPaths(siteIdInput);
  await createDefaultPagesForSite(paths.siteId);
  const page = validatePageDocument(input);
  const { file } = pageFile(paths.siteId, page.pageId);
  if (await exists(file)) throw badRequest("Page already exists.");
  await fs.mkdir(paths.pagesDir, { recursive: true });
  await writeFileAtomic(file, stableJson(page));
  const index = await readIndex(paths.siteId);
  if (!index.pageOrder.includes(page.pageId)) index.pageOrder.push(page.pageId);
  index.updatedAt = new Date().toISOString();
  await writeIndex(paths.siteId, index);
  return page;
}

export async function updatePage(siteIdInput: string, pageIdInput: string, input: unknown): Promise<PageDocument> {
  const { siteId, pageId, file } = pageFile(siteIdInput, pageIdInput);
  const current = await readPage(siteId, pageId);
  const next = validatePageDocument({ ...(input as Record<string, unknown>), pageId, createdAt: current.createdAt, updatedAt: new Date().toISOString() });
  await backupPage(siteId, pageId, file);
  await writeFileAtomic(file, stableJson(next));
  const index = await readIndex(siteId);
  if (!index.pageOrder.includes(pageId)) index.pageOrder.push(pageId);
  index.publishedStatus = next.status === "published" ? "published" : index.publishedStatus;
  index.updatedAt = next.updatedAt;
  await writeIndex(siteId, index);
  return next;
}

export function validatePagePayload(input: unknown): { valid: true; page: PageDocument; errors: [] } | { valid: false; errors: string[] } {
  try {
    return { valid: true, page: validatePageDocument(input), errors: [] };
  } catch (error) {
    return { valid: false, errors: [error instanceof Error ? error.message : "Invalid page payload."] };
  }
}
