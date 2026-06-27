import path from "node:path";
import { validateSiteId } from "../validation/siteId";

export function dataRoot(): string {
  return path.resolve(process.env.THEME_SETTINGS_DATA_DIR ?? path.join(process.cwd(), "data"));
}

export function sitesRoot(): string {
  return path.join(dataRoot(), "sites");
}

export function siteDir(siteIdInput: unknown): { siteId: string; dir: string } {
  const siteId = validateSiteId(siteIdInput);
  const root = sitesRoot();
  const dir = path.join(root, siteId);
  const relative = path.relative(root, dir);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Unsafe site path resolved outside site storage.");
  }
  return { siteId, dir };
}

export function settingsPath(siteIdInput: unknown): { siteId: string; file: string; dir: string } {
  const resolved = siteDir(siteIdInput);
  return { ...resolved, file: path.join(resolved.dir, "settings.json") };
}
