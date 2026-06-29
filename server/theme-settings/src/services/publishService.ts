import fs from "node:fs/promises";
import path from "node:path";
import { customJsPublishingEnabled } from "../config";
import { BlockDocument, PageDocument, SiteContentIndex } from "../types/content";
import { badRequest, notFound } from "../utils/errors";
import { validatePageDocument, validateSiteContentIndex } from "../validation/contentValidation";
import { validateSiteId } from "../validation/siteId";
import { readCustomCode, readSettings, rebuildThemeCss } from "./siteService";
import { dataRoot, siteDir } from "./paths";

type PublishOptions = {
  includeDrafts?: boolean;
  allowCustomJs?: boolean;
};

export type PublishResult = {
  siteId: string;
  mode: "preview" | "published";
  outputPath: string;
  previewPath: string;
  generatedAt: string;
  pages: Array<{ pageId: string; slug: string; path: string; status: string }>;
  assets: {
    baseCss: string;
    themeCss: string;
    customCss: string | null;
    customJs: string | null;
  };
  warnings: string[];
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function attr(value: unknown): string {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function readSiteContentIndex(siteId: string, sitePath: string): Promise<SiteContentIndex> {
  const file = path.join(sitePath, "site-content.json");
  if (!(await exists(file))) throw badRequest("Site content index is missing.");
  return validateSiteContentIndex(JSON.parse(await fs.readFile(file, "utf8")) as unknown);
}

async function readPublishPages(siteId: string, sitePath: string, index: SiteContentIndex): Promise<PageDocument[]> {
  if (index.pageOrder.length === 0) throw badRequest("Site has no pages to publish.");
  const pagesDir = path.join(sitePath, "pages");
  if (!(await exists(pagesDir))) throw badRequest("Site pages folder is missing.");
  const pages = [];
  for (const pageId of index.pageOrder) {
    const file = path.join(pagesDir, `${pageId}.json`);
    const relative = path.relative(pagesDir, file);
    if (relative.startsWith("..") || path.isAbsolute(relative)) throw badRequest("Unsafe page path in content index.");
    if (!(await exists(file))) throw badRequest(`Page JSON is missing: ${pageId}`);
    const page = validatePageDocument(JSON.parse(await fs.readFile(file, "utf8")) as unknown);
    if (page.pageId !== pageId) throw badRequest(`Page ID mismatch for ${pageId}.`);
    pages.push(page);
  }
  return pages;
}

function outputPathForPage(page: PageDocument, defaultPageId: string): string {
  return page.pageId === defaultPageId ? "index.html" : path.posix.join(page.slug, "index.html");
}

function relativeAssetPrefix(pageOutputPath: string): string {
  return pageOutputPath === "index.html" ? "" : "../";
}

function findBaseCss(): string {
  const candidates = [
    path.resolve(process.cwd(), "..", "..", "dist", "ss.css"),
    path.resolve(process.cwd(), "dist", "ss.css")
  ];
  const found = candidates.find((candidate) => require("node:fs").existsSync(candidate));
  if (!found) throw notFound("Base dist/ss.css file was not found.");
  return found;
}

function sectionClasses(sectionType: string, background: string): string {
  const classes = ["ss-section", `ss-section-${sectionType}`];
  const backgroundMap: Record<string, string> = {
    surface: "ss-section-surface",
    soft: "ss-section-soft",
    "primary-soft": "ss-section-primary-soft",
    "accent-soft": "ss-section-accent-soft",
    dark: "ss-section-dark"
  };
  if (backgroundMap[background]) classes.push(backgroundMap[background]);
  return classes.join(" ");
}

function textField(block: BlockDocument, key: string, fallback = ""): string {
  const value = block.content[key];
  return typeof value === "string" ? value : fallback;
}

function renderLink(block: BlockDocument, classes = "ss-btn"): string {
  const text = textField(block, "text", block.link?.label ?? block.label);
  const href = block.link?.href ?? "#";
  const target = block.link?.target ?? "_self";
  return `<a class="${classes}" href="${attr(href)}" target="${attr(target)}">${escapeHtml(text)}</a>`;
}

function renderImage(block: BlockDocument): string {
  const src = block.media?.src ?? textField(block, "src", "");
  const alt = block.media?.alt ?? textField(block, "alt", "");
  if (!src) return `<div class="ss-missing-media">${escapeHtml(block.label)}</div>`;
  return `<figure class="ss-media-frame"><img src="${attr(src)}" alt="${attr(alt)}"></figure>`;
}

function renderList(block: BlockDocument): string {
  const items = Array.isArray(block.content.items) ? block.content.items : [];
  return `<ul class="ss-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderBusinessHours(block: BlockDocument): string {
  const rows = Array.isArray(block.content.rows) ? block.content.rows : [];
  const rendered = rows.map((row) => {
    if (!row || typeof row !== "object") return "";
    const item = row as Record<string, unknown>;
    return `<div class="ss-business-hours-row"><span>${escapeHtml(item.day)}</span><strong>${escapeHtml(item.hours)}</strong></div>`;
  }).join("");
  return `<article class="ss-business-hours-card"><h3 class="ss-h4">${escapeHtml(textField(block, "title", block.label))}</h3>${rendered}</article>`;
}

function orderedChildBlocks(block: BlockDocument): BlockDocument[] {
  const order = block.blockOrder ?? block.blocks?.map((child) => child.blockId) ?? [];
  return order
    .map((blockId) => block.blocks?.find((child) => child.blockId === blockId))
    .filter((child): child is BlockDocument => Boolean(child));
}

function customClassName(block: BlockDocument): string {
  if (typeof block.style.className !== "string") return "";
  const systemClasses = new Set(["ss-section-wide", "ss-grid", "ss-cols-2", "ss-cols-3", "ss-stack", "ss-split", "ss-row", "ss-wrap", "ss-gap-4", "ss-gap-6"]);
  return block.style.className.split(/\s+/).filter(Boolean).filter((item) => !systemClasses.has(item)).join(" ");
}

function legacyStructuralType(block: BlockDocument): BlockDocument["type"] | undefined {
  if (block.type !== "card" || Object.keys(block.content).length > 0) return undefined;
  const labelType = block.label.trim().toLowerCase();
  return ["container", "grid", "stack", "cluster", "split", "group"].includes(labelType) ? labelType as BlockDocument["type"] : undefined;
}

function layoutClasses(block: BlockDocument): string {
  const blockType = legacyStructuralType(block) ?? block.type;
  if (blockType === "container") return ["ss-section-wide", customClassName(block)].filter(Boolean).join(" ");
  if (blockType === "stack") return ["ss-stack", "ss-gap-6", customClassName(block)].filter(Boolean).join(" ");
  if (blockType === "cluster" || blockType === "group") return ["ss-row", "ss-wrap", "ss-gap-4", customClassName(block)].filter(Boolean).join(" ");
  if (blockType === "split") return ["ss-split", "ss-gap-6", customClassName(block)].filter(Boolean).join(" ");
  const layout = typeof block.style.layout === "string" ? block.style.layout : String(block.content.layout ?? "halves-vertical");
  const layoutClass = layout === "thirds-vertical"
    ? "ss-grid ss-cols-3 ss-gap-6"
    : layout === "halves-horizontal"
      ? "ss-stack ss-gap-6"
      : layout === "one-side-split"
        ? "ss-split ss-gap-6"
        : "ss-grid ss-cols-2 ss-gap-6";
  return [layoutClass, customClassName(block)].filter(Boolean).join(" ");
}

function renderLayoutBlock(block: BlockDocument): string {
  const children = orderedChildBlocks(block).map(renderBlock).join("\n");
  return `<div class="${attr(layoutClasses(block))}">${children}</div>`;
}

function renderBlock(block: BlockDocument): string {
  if (block.hidden) return "";
  if (legacyStructuralType(block)) return renderLayoutBlock(block);
  switch (block.type) {
    case "heading": {
      const requestedLevel = Number(block.style.level ?? 2);
      const level = Math.min(6, Math.max(1, Number.isFinite(requestedLevel) ? requestedLevel : 2));
      const className = level === 1 ? "ss-section-title" : "ss-h3";
      return `<h${level} class="${className}">${escapeHtml(textField(block, "text", block.label))}</h${level}>`;
    }
    case "text":
      return `<p class="ss-text">${escapeHtml(textField(block, "text", ""))}</p>`;
    case "button":
      return renderLink(block);
    case "image":
      return renderImage(block);
    case "container":
    case "grid":
    case "stack":
    case "cluster":
    case "split":
    case "group":
      return renderLayoutBlock(block);
    case "card":
      return `<article class="ss-card"><div class="ss-card-body"><h3 class="ss-card-title">${escapeHtml(textField(block, "title", block.label))}</h3><p class="ss-card-subtitle">${escapeHtml(textField(block, "text", ""))}</p></div></article>`;
    case "list":
      return renderList(block);
    case "form-placeholder":
      return `<div class="ss-contact-form-card"><p class="ss-text ss-text-muted">${escapeHtml(textField(block, "text", "Form integration placeholder."))}</p></div>`;
    case "map-placeholder":
      return `<div class="ss-map-wrapper"><p class="ss-text ss-text-muted">${escapeHtml(textField(block, "text", "Map placeholder."))}</p></div>`;
    case "business-hours":
      return renderBusinessHours(block);
    case "testimonial":
      return `<article class="ss-testimonial-card"><p class="ss-review-quote">${escapeHtml(textField(block, "quote", textField(block, "text", "")))}</p><strong class="ss-reviewer-name">${escapeHtml(textField(block, "name", block.label))}</strong></article>`;
    case "custom-html":
      return "";
    default:
      return "";
  }
}

function renderSection(section: PageDocument["sections"][number]): string {
  if (section.hidden) return "";
  const blocks = section.blockOrder
    .map((blockId) => section.blocks.find((block) => block.blockId === blockId))
    .filter((block): block is BlockDocument => Boolean(block))
    .map(renderBlock)
    .join("\n");
  const innerClass = section.layoutPreset === "split" ? "ss-section-wide ss-section-split" : section.layoutPreset === "grid" ? "ss-section-wide ss-grid ss-md-cols-2 ss-gap-6" : section.layoutPreset === "centered" ? "ss-section-narrow ss-section-center" : "ss-section-wide";
  return `<section class="${sectionClasses(section.type, section.background)}" id="${attr(section.sectionId)}"><div class="${innerClass}">${blocks}</div></section>`;
}

function renderNavigation(pages: PageDocument[], current: PageDocument, defaultPageId: string): string {
  const links = pages
    .filter((page) => page.navigation.showInNavigation)
    .sort((a, b) => a.navigation.order - b.navigation.order)
    .map((page) => {
      const href = page.pageId === defaultPageId ? "index.html" : `${page.slug}/`;
      const prefix = current.pageId === defaultPageId ? "" : "../";
      return `<a class="ss-navbar-link" href="${attr(prefix + href)}">${escapeHtml(page.navigation.label)}</a>`;
    }).join("");
  return `<nav class="ss-navbar"><a class="ss-navbar-brand" href="${current.pageId === defaultPageId ? "index.html" : "../index.html"}">${escapeHtml(pages[0]?.navigation.label ?? "Home")}</a><div class="ss-nav ss-nav-wrap">${links}</div></nav>`;
}

function renderPage(siteId: string, page: PageDocument, pages: PageDocument[], index: SiteContentIndex, assets: PublishResult["assets"]): string {
  const pageOutputPath = outputPathForPage(page, index.defaultPageId);
  const prefix = relativeAssetPrefix(pageOutputPath);
  const cssLinks = [
    `<link rel="stylesheet" href="${prefix}css/ss.css">`,
    `<link rel="stylesheet" href="${prefix}css/theme.css">`,
    assets.customCss ? `<link rel="stylesheet" href="${prefix}css/custom.css">` : ""
  ].filter(Boolean).join("\n    ");
  const jsLink = assets.customJs ? `\n    <script src="${prefix}js/custom.js" defer></script>` : "";
  const sections = page.sectionOrder
    .map((sectionId) => page.sections.find((section) => section.sectionId === sectionId))
    .filter((section): section is PageDocument["sections"][number] => Boolean(section))
    .map(renderSection)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.seo.title || page.title)}</title>
    <meta name="description" content="${attr(page.seo.description)}">
    ${cssLinks}
  </head>
  <body class="ss-page ss-site ss-published ss-client-theme" data-ss-published="true" data-ss-site-theme="${attr(siteId)}">
    ${renderNavigation(pages, page, index.defaultPageId)}
    <main class="ss-site-page">
${sections}
    </main>${jsLink}
  </body>
</html>
`;
}

async function copyAssetReferences(sitePath: string, outputPath: string, pages: PageDocument[]): Promise<void> {
  async function copyBlockAsset(block: BlockDocument): Promise<void> {
    const src = block.media?.src;
    if (src) {
      if (src.startsWith("https://")) return;
      if (!src.startsWith("assets/") || src.includes("..") || src.includes("\\")) {
        throw badRequest(`Unsafe or unsupported asset path: ${src}`);
      }
      const source = path.join(sitePath, src);
      if (!(await exists(source))) throw badRequest(`Referenced asset was not found: ${src}`);
      const destination = path.join(outputPath, src);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(source, destination);
    }
    for (const child of block.blocks ?? []) await copyBlockAsset(child);
  }
  for (const page of pages) {
    for (const section of page.sections) {
      for (const block of section.blocks) {
        await copyBlockAsset(block);
      }
    }
  }
}

export async function publishSite(siteIdInput: string, options: PublishOptions = {}): Promise<PublishResult> {
  const siteId = validateSiteId(siteIdInput);
  const { dir } = siteDir(siteId);
  const settings = await readSettings(siteId);
  const index = await readSiteContentIndex(siteId, dir);
  const allPages = await readPublishPages(siteId, dir, index);
  const pages = options.includeDrafts ? allPages : allPages.filter((page) => page.status === "published");
  if (pages.length === 0) throw badRequest("No published pages are available to publish.");
  if (!pages.some((page) => page.pageId === index.defaultPageId)) throw badRequest("Default page is missing from publishable pages.");

  const outputPaths = new Set<string>();
  for (const page of pages) {
    const pageOutputPath = outputPathForPage(page, index.defaultPageId);
    if (outputPaths.has(pageOutputPath)) throw badRequest(`Duplicate output path: ${pageOutputPath}`);
    outputPaths.add(pageOutputPath);
  }

  await rebuildThemeCss(siteId);
  const outputPath = path.join(dataRoot(), "published", siteId);
  await fs.rm(outputPath, { recursive: true, force: true });
  await fs.mkdir(path.join(outputPath, "css"), { recursive: true });

  await fs.copyFile(findBaseCss(), path.join(outputPath, "css", "ss.css"));
  await fs.copyFile(path.join(dir, "theme.css"), path.join(outputPath, "css", "theme.css"));

  const warnings: string[] = [];
  const customCss = await readCustomCode(siteId, "css");
  const customCssOutput = customCss.enabled && customCss.content.trim().length > 0 ? "css/custom.css" : null;
  if (customCssOutput) {
    await fs.writeFile(path.join(outputPath, customCssOutput), customCss.content, "utf8");
  }

  const customJs = await readCustomCode(siteId, "js");
  const includeCustomJs = Boolean(options.allowCustomJs && customJsPublishingEnabled() && customJs.enabled && customJs.content.trim().length > 0);
  if (customJs.enabled && !includeCustomJs) {
    warnings.push("Custom JS was enabled for the site but excluded from publish output by configuration.");
  }
  const customJsOutput = includeCustomJs ? "js/custom.js" : null;
  if (customJsOutput) {
    await fs.mkdir(path.join(outputPath, "js"), { recursive: true });
    await fs.writeFile(path.join(outputPath, customJsOutput), customJs.content, "utf8");
  }

  await copyAssetReferences(dir, outputPath, pages);

  const assets = {
    baseCss: "css/ss.css",
    themeCss: "css/theme.css",
    customCss: customCssOutput,
    customJs: customJsOutput
  };
  const pageOutputs = [];
  for (const page of pages) {
    const pageOutputPath = outputPathForPage(page, index.defaultPageId);
    const file = path.join(outputPath, pageOutputPath);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, renderPage(siteId, page, pages, index, assets), "utf8");
    pageOutputs.push({ pageId: page.pageId, slug: page.slug, path: pageOutputPath, status: page.status });
  }

  const result: PublishResult = {
    siteId,
    mode: options.includeDrafts ? "preview" : "published",
    outputPath,
    previewPath: `/preview/${siteId}/index.html`,
    generatedAt: new Date().toISOString(),
    pages: pageOutputs,
    assets,
    warnings
  };
  await fs.writeFile(path.join(outputPath, "publish.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  return result;
}

export async function readPublishMetadata(siteIdInput: string): Promise<PublishResult> {
  const siteId = validateSiteId(siteIdInput);
  const file = path.join(dataRoot(), "published", siteId, "publish.json");
  if (!(await exists(file))) throw notFound("Published output metadata not found.");
  return JSON.parse(await fs.readFile(file, "utf8")) as PublishResult;
}
