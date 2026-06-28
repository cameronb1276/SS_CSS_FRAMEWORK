import fs from "node:fs/promises";
import path from "node:path";
import { PageDocument } from "../types/content";
import { badRequest, notFound } from "../utils/errors";
import { validatePageDocument } from "../validation/contentValidation";
import { siteDir } from "./paths";
import { readPage, updatePage } from "./contentService";
import { writeAuditEvent } from "./auditLog";

type RevisionMeta = {
  revisionId: string;
  siteId: string;
  pageId: string;
  operation: string;
  targetElementId: string | null;
  actor: string;
  summary: string;
  createdAt: string;
};

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function safeRevisionId(input: unknown): string {
  if (typeof input !== "string" || !/^[0-9T-Za-z-]+-[a-f0-9]{8}$/.test(input)) {
    throw badRequest("revisionId is not valid.");
  }
  return input;
}

function revisionRoot(siteId: string, pageId: string): string {
  return path.join(siteDir(siteId).dir, "revisions", pageId);
}

function redoRoot(siteId: string, pageId: string): string {
  return path.join(siteDir(siteId).dir, "redo", pageId);
}

function revisionId(): string {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${Math.random().toString(16).slice(2, 10)}`;
}

async function writeSnapshot(folder: string, page: PageDocument, meta: Omit<RevisionMeta, "revisionId" | "createdAt">): Promise<RevisionMeta> {
  await fs.mkdir(folder, { recursive: true });
  const id = revisionId();
  const createdAt = new Date().toISOString();
  const fullMeta: RevisionMeta = { revisionId: id, createdAt, ...meta };
  await fs.writeFile(path.join(folder, `${id}.json`), stableJson(validatePageDocument(page)), "utf8");
  await fs.writeFile(path.join(folder, `${id}.meta.json`), stableJson(fullMeta), "utf8");
  return fullMeta;
}

async function trimSnapshots(folder: string, limit = 20): Promise<void> {
  await fs.mkdir(folder, { recursive: true });
  const metas = (await fs.readdir(folder)).filter((name) => name.endsWith(".meta.json")).sort();
  const excess = metas.slice(0, Math.max(0, metas.length - limit));
  await Promise.all(excess.flatMap((metaName) => {
    const id = metaName.replace(".meta.json", "");
    return [
      fs.rm(path.join(folder, metaName), { force: true }),
      fs.rm(path.join(folder, `${id}.json`), { force: true })
    ];
  }));
}

export async function createRevisionSnapshot(siteId: string, pageId: string, page: PageDocument, options: { operation?: string; targetElementId?: string | null; actor?: string; summary?: string } = {}): Promise<RevisionMeta> {
  const folder = revisionRoot(siteId, pageId);
  const meta = await writeSnapshot(folder, page, {
    siteId,
    pageId,
    operation: options.operation ?? "page.update",
    targetElementId: options.targetElementId ?? null,
    actor: options.actor ?? "backend",
    summary: options.summary ?? "Snapshot before page replacement"
  });
  await trimSnapshots(folder);
  await writeAuditEvent({ action: "revision.created", result: "success", siteId, metadata: { pageId, operation: meta.operation, revisionId: meta.revisionId } });
  return meta;
}

export async function listRevisions(siteId: string, pageId: string): Promise<RevisionMeta[]> {
  const folder = revisionRoot(siteId, pageId);
  try {
    const metas = (await fs.readdir(folder)).filter((name) => name.endsWith(".meta.json")).sort().reverse();
    return Promise.all(metas.map(async (name) => JSON.parse(await fs.readFile(path.join(folder, name), "utf8")) as RevisionMeta));
  } catch {
    return [];
  }
}

async function readSnapshot(folder: string, idInput: string): Promise<PageDocument> {
  const id = safeRevisionId(idInput);
  const file = path.join(folder, `${id}.json`);
  try {
    return validatePageDocument(JSON.parse(await fs.readFile(file, "utf8")) as unknown);
  } catch (error) {
    if (error instanceof Error && "code" in error) throw notFound("Revision snapshot not found.");
    throw error;
  }
}

async function deleteSnapshot(folder: string, idInput: string): Promise<void> {
  const id = safeRevisionId(idInput);
  await fs.rm(path.join(folder, `${id}.json`), { force: true });
  await fs.rm(path.join(folder, `${id}.meta.json`), { force: true });
}

export async function restoreRevision(siteId: string, pageId: string, revisionIdInput: string, actor = "backend"): Promise<PageDocument> {
  const snapshot = await readSnapshot(revisionRoot(siteId, pageId), revisionIdInput);
  const restored = await updatePage(siteId, pageId, snapshot);
  await writeAuditEvent({ action: "revision.restored", result: "success", siteId, metadata: { pageId, revisionId: revisionIdInput } });
  return restored;
}

export async function undoPage(siteId: string, pageId: string, actor = "backend"): Promise<{ page: PageDocument; revisionId: string }> {
  const revisions = await listRevisions(siteId, pageId);
  const latest = revisions[0];
  if (!latest) throw badRequest("No revisions are available to undo.");
  const current = await readPage(siteId, pageId);
  await writeSnapshot(redoRoot(siteId, pageId), current, {
    siteId,
    pageId,
    operation: "redo.snapshot",
    targetElementId: latest.targetElementId,
    actor,
    summary: "Snapshot before undo"
  });
  const snapshot = await readSnapshot(revisionRoot(siteId, pageId), latest.revisionId);
  await deleteSnapshot(revisionRoot(siteId, pageId), latest.revisionId);
  const page = await updatePage(siteId, pageId, snapshot);
  await writeAuditEvent({ action: "history.undo", result: "success", siteId, metadata: { pageId, revisionId: latest.revisionId } });
  return { page, revisionId: latest.revisionId };
}

export async function redoPage(siteId: string, pageId: string, actor = "backend"): Promise<{ page: PageDocument; revisionId: string }> {
  const folder = redoRoot(siteId, pageId);
  const metas = (await fs.readdir(folder).catch(() => [])).filter((name) => name.endsWith(".meta.json")).sort().reverse();
  const latestMeta = metas[0];
  if (!latestMeta) throw badRequest("No redo snapshot is available.");
  const redoId = latestMeta.replace(".meta.json", "");
  const snapshot = await readSnapshot(folder, redoId);
  await deleteSnapshot(folder, redoId);
  const page = await updatePage(siteId, pageId, snapshot);
  await writeAuditEvent({ action: "history.redo", result: "success", siteId, metadata: { pageId, revisionId: redoId } });
  return { page, revisionId: redoId };
}
