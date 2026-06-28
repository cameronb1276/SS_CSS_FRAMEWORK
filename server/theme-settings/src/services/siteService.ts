import fs from "node:fs/promises";
import path from "node:path";
import { notFound, badRequest } from "../utils/errors";
import { ThemeSettingsDocument, SettingsUpdate } from "../types/settings";
import { validateSettingsDocument } from "../validation/settingsValidation";
import { defaultSettings } from "./defaults";
import { generateThemeCss } from "./themeCss";
import { dataRoot, settingsPath, siteDir, sitesRoot } from "./paths";
import { writeAuditEvent } from "./auditLog";
import { createDefaultPagesForSite } from "./contentService";

async function exists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function ensureStorage(): Promise<void> {
  await fs.mkdir(sitesRoot(), { recursive: true });
  await fs.mkdir(path.join(dataRoot(), "themes"), { recursive: true });
  await fs.mkdir(path.join(dataRoot(), "backups"), { recursive: true });
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function writeFileAtomic(file: string, content: string): Promise<void> {
  const tmp = `${file}.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  await fs.writeFile(tmp, content, "utf8");
  await fs.rename(tmp, file);
}

async function backupSettings(siteId: string, sourceFile: string, sitePath: string): Promise<void> {
  if (!(await exists(sourceFile))) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(sitePath, "backups");
  await fs.mkdir(backupDir, { recursive: true });
  await fs.copyFile(sourceFile, path.join(backupDir, `settings.${stamp}.json`));
  await fs.copyFile(sourceFile, path.join(dataRoot(), "backups", `${siteId}.settings.${stamp}.json`));

  const backups = (await fs.readdir(backupDir)).filter((name) => name.startsWith("settings.") && name.endsWith(".json")).sort();
  const excess = backups.slice(0, Math.max(0, backups.length - 10));
  await Promise.all(excess.map((name) => fs.rm(path.join(backupDir, name), { force: true })));
  await writeAuditEvent({ action: "backup.created", result: "success", siteId, metadata: { kind: "settings" } });
}

function deepMerge(base: unknown, patch: unknown): unknown {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return patch;
  if (!base || typeof base !== "object" || Array.isArray(base)) return patch;
  const merged: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    merged[key] = deepMerge(merged[key], value);
  }
  return merged;
}

export async function listSites(): Promise<Array<{ siteId: string; name: string; published: boolean; updatedAt: string }>> {
  await ensureStorage();
  const entries = await fs.readdir(sitesRoot(), { withFileTypes: true });
  const sites = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      const settings = await readSettings(entry.name);
      sites.push({
        siteId: settings.site.id,
        name: settings.site.name,
        published: settings.published.published,
        updatedAt: settings.timestamps.updatedAt
      });
    } catch {
      // Ignore incomplete runtime folders.
    }
  }
  return sites.sort((a, b) => a.siteId.localeCompare(b.siteId));
}

export async function createSite(input: { siteId: string; siteName?: string; themeName?: string }): Promise<ThemeSettingsDocument> {
  await ensureStorage();
  const { siteId, dir } = siteDir(input.siteId);
  const file = path.join(dir, "settings.json");
  if (await exists(file)) {
    throw badRequest("Site already exists.");
  }
  await fs.mkdir(dir, { recursive: true });
  await fs.mkdir(path.join(dir, "backups"), { recursive: true });
  const settings = defaultSettings(siteId, input.siteName, input.themeName);
  await writeFileAtomic(file, stableJson(settings));
  await writeFileAtomic(path.join(dir, "theme.css"), generateThemeCss(settings));
  await writeFileAtomic(path.join(dir, "custom.css"), "");
  await writeFileAtomic(path.join(dir, "custom.js"), "");
  await createDefaultPagesForSite(siteId, settings.site.name);
  return settings;
}

export async function readSettings(siteIdInput: string): Promise<ThemeSettingsDocument> {
  const { file } = settingsPath(siteIdInput);
  if (!(await exists(file))) {
    throw notFound("Site settings not found.");
  }
  const parsed = JSON.parse(await fs.readFile(file, "utf8")) as unknown;
  return validateSettingsDocument(parsed);
}

export async function updateSettings(siteIdInput: string, update: SettingsUpdate): Promise<ThemeSettingsDocument> {
  const { siteId, file, dir } = settingsPath(siteIdInput);
  const current = await readSettings(siteId);
  const merged = deepMerge(current, update) as ThemeSettingsDocument;
  merged.schemaVersion = 1;
  merged.site.id = siteId;
  merged.timestamps.createdAt = current.timestamps.createdAt;
  merged.timestamps.updatedAt = new Date().toISOString();
  merged.published.cssCacheVersion = merged.timestamps.updatedAt;
  const validated = validateSettingsDocument(merged);
  await backupSettings(siteId, file, dir);
  await writeFileAtomic(file, stableJson(validated));
  return validated;
}

export async function rebuildThemeCss(siteIdInput: string): Promise<{ siteId: string; path: string; generatedAt: string; bytes: number }> {
  const { siteId, dir } = siteDir(siteIdInput);
  const settings = await readSettings(siteId);
  const generatedAt = new Date().toISOString();
  settings.published.lastPublishedAt = generatedAt;
  settings.published.cssCacheVersion = generatedAt;
  settings.published.themeFilePath = "theme.css";
  settings.timestamps.updatedAt = generatedAt;
  const css = generateThemeCss(settings);
  const file = path.join(dir, "theme.css");
  await backupSettings(siteId, path.join(dir, "settings.json"), dir);
  await writeFileAtomic(path.join(dir, "settings.json"), stableJson(validateSettingsDocument(settings)));
  await writeFileAtomic(file, css);
  return { siteId, path: "theme.css", generatedAt, bytes: Buffer.byteLength(css) };
}

export async function themeMetadata(siteIdInput: string): Promise<{ siteId: string; exists: boolean; path: string; bytes: number; updatedAt: string | null; cssCacheVersion: string }> {
  const { siteId, dir } = siteDir(siteIdInput);
  const settings = await readSettings(siteId);
  const file = path.join(dir, "theme.css");
  if (!(await exists(file))) {
    return { siteId, exists: false, path: "theme.css", bytes: 0, updatedAt: null, cssCacheVersion: settings.published.cssCacheVersion };
  }
  const stat = await fs.stat(file);
  return { siteId, exists: true, path: "theme.css", bytes: stat.size, updatedAt: stat.mtime.toISOString(), cssCacheVersion: settings.published.cssCacheVersion };
}

export async function readCustomCode(siteIdInput: string, kind: "css" | "js"): Promise<{ enabled: boolean; content: string; bytes: number; updatedAt: string | null }> {
  const { siteId, dir } = siteDir(siteIdInput);
  const settings = await readSettings(siteId);
  const file = path.join(dir, kind === "css" ? "custom.css" : "custom.js");
  const content = (await exists(file)) ? await fs.readFile(file, "utf8") : "";
  return {
    enabled: kind === "css" ? settings.published.customCssEnabled : settings.published.customJsEnabled,
    content,
    bytes: Buffer.byteLength(content),
    updatedAt: kind === "css" ? settings.customCode.customCssUpdatedAt : settings.customCode.customJsUpdatedAt
  };
}

export async function updateCustomCode(siteIdInput: string, kind: "css" | "js", enabled: boolean, content: string): Promise<{ enabled: boolean; bytes: number; updatedAt: string }> {
  const { siteId, dir } = siteDir(siteIdInput);
  const now = new Date().toISOString();
  const file = path.join(dir, kind === "css" ? "custom.css" : "custom.js");
  await readSettings(siteId);
  await writeFileAtomic(file, content);
  const size = Buffer.byteLength(content);
  const patch: SettingsUpdate = kind === "css"
    ? { published: { customCssEnabled: enabled }, customCode: { customCssUpdatedAt: now, customCssSize: size } }
    : { published: { customJsEnabled: enabled }, customCode: { customJsUpdatedAt: now, customJsSize: size } };
  await updateSettings(siteId, patch);
  return { enabled, bytes: size, updatedAt: now };
}
