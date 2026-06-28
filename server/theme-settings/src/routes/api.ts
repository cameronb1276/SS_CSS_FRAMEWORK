import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { badRequest } from "../utils/errors";
import {
  createSite,
  listSites,
  readCustomCode,
  readSettings,
  rebuildThemeCss,
  themeMetadata,
  updateCustomCode,
  updateSettings
} from "../services/siteService";
import { validateCustomCssPayload, validateCustomJsPayload, validateSettingsUpdate, assertPlainObject } from "../validation/settingsValidation";
import { validateSiteId } from "../validation/siteId";
import { requireAccess } from "../middleware/auth";
import { writeRateLimit } from "../middleware/rateLimit";
import { requireJsonContent } from "../middleware/requestGuards";
import { auditEventFromRequest } from "../services/auditLog";
import { customJsEditingEnabled, serverPort } from "../config";
import { createPage, listPages, readPage, updatePage, validatePagePayload } from "../services/contentService";
import { validateContentId } from "../validation/contentValidation";

export const apiRouter = Router();

function asyncRoute(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
  return (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
}

apiRouter.get("/health", (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: "ss-theme-settings",
    port: serverPort(),
    timestamp: new Date().toISOString()
  });
});

apiRouter.get("/sites", requireAccess("list-sites"), asyncRoute(async (_req, res) => {
  res.json({ sites: await listSites() });
}));

apiRouter.post("/sites", requireAccess("create-site"), writeRateLimit, requireJsonContent, asyncRoute(async (req, res) => {
  const body = assertPlainObject(req.body, "create site payload");
  const siteId = validateSiteId(body.siteId);
  const siteName = body.siteName === undefined ? undefined : String(body.siteName);
  const themeName = body.themeName === undefined ? undefined : String(body.themeName);
  if (siteName !== undefined && (siteName.trim().length === 0 || siteName.length > 120)) {
    throw badRequest("siteName must be between 1 and 120 characters.");
  }
  if (themeName !== undefined && (themeName.trim().length === 0 || themeName.length > 80)) {
    throw badRequest("themeName must be between 1 and 80 characters.");
  }
  const settings = await createSite({ siteId, siteName, themeName });
  await auditEventFromRequest(req, { action: "site.created", result: "success", siteId });
  res.status(201).json({ settings });
}));

apiRouter.get("/sites/:siteId/settings", requireAccess("read-settings", (req) => req.params.siteId), asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  await auditEventFromRequest(req, { action: "settings.read", result: "success", siteId: req.params.siteId });
  res.json({ settings: await readSettings(req.params.siteId) });
}));

apiRouter.put("/sites/:siteId/settings", requireAccess("update-settings", (req) => req.params.siteId), writeRateLimit, requireJsonContent, asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  const update = validateSettingsUpdate(req.body);
  const settings = await updateSettings(req.params.siteId, update);
  await auditEventFromRequest(req, { action: "settings.updated", result: "success", siteId: req.params.siteId });
  res.json({ settings });
}));

apiRouter.post("/sites/:siteId/rebuild-theme", requireAccess("rebuild-theme", (req) => req.params.siteId), writeRateLimit, requireJsonContent, asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  const theme = await rebuildThemeCss(req.params.siteId);
  await auditEventFromRequest(req, { action: "theme.rebuilt", result: "success", siteId: req.params.siteId, metadata: { bytes: theme.bytes } });
  res.json({ theme });
}));

apiRouter.get("/sites/:siteId/theme", requireAccess("read-theme", (req) => req.params.siteId), asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  res.json({ theme: await themeMetadata(req.params.siteId) });
}));

apiRouter.get("/sites/:siteId/custom-css", requireAccess("read-custom-css", (req) => req.params.siteId), asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  res.json({ customCss: await readCustomCode(req.params.siteId, "css") });
}));

apiRouter.put("/sites/:siteId/custom-css", requireAccess("update-custom-css", (req) => req.params.siteId), writeRateLimit, requireJsonContent, asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  const payload = validateCustomCssPayload(req.body);
  const customCss = await updateCustomCode(req.params.siteId, "css", payload.enabled, payload.content);
  await auditEventFromRequest(req, { action: "custom-css.updated", result: "success", siteId: req.params.siteId, metadata: { enabled: payload.enabled, bytes: customCss.bytes } });
  res.json({ customCss });
}));

apiRouter.get("/sites/:siteId/custom-js", requireAccess("read-custom-js", (req) => req.params.siteId), asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  res.json({ customJs: await readCustomCode(req.params.siteId, "js") });
}));

apiRouter.put("/sites/:siteId/custom-js", requireAccess("update-custom-js", (req) => req.params.siteId), writeRateLimit, requireJsonContent, asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  const payload = validateCustomJsPayload(req.body);
  if (!customJsEditingEnabled() && (payload.enabled || payload.content.trim().length > 0)) {
    throw badRequest("Custom JS editing is disabled. Set CUSTOM_JS_EDITING_ENABLED=true to allow admin JS edits.");
  }
  const customJs = await updateCustomCode(req.params.siteId, "js", payload.enabled, payload.content);
  await auditEventFromRequest(req, { action: "custom-js.updated", result: "success", siteId: req.params.siteId, metadata: { enabled: payload.enabled, bytes: customJs.bytes } });
  res.json({ customJs });
}));

apiRouter.get("/sites/:siteId/pages", requireAccess("read-pages", (req) => req.params.siteId), asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  res.json(await listPages(req.params.siteId));
}));

apiRouter.post("/sites/:siteId/pages", requireAccess("create-page", (req) => req.params.siteId), writeRateLimit, requireJsonContent, asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  const page = await createPage(req.params.siteId, req.body);
  await auditEventFromRequest(req, { action: "page.created", result: "success", siteId: req.params.siteId, metadata: { pageId: page.pageId } });
  res.status(201).json({ page });
}));

apiRouter.post("/sites/:siteId/pages/validate", requireAccess("validate-page", (req) => req.params.siteId), writeRateLimit, requireJsonContent, asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  res.json(validatePagePayload(req.body));
}));

apiRouter.get("/sites/:siteId/pages/:pageId", requireAccess("read-page", (req) => req.params.siteId), asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  validateContentId(req.params.pageId, "pageId");
  res.json({ page: await readPage(req.params.siteId, req.params.pageId) });
}));

apiRouter.put("/sites/:siteId/pages/:pageId", requireAccess("update-page", (req) => req.params.siteId), writeRateLimit, requireJsonContent, asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  validateContentId(req.params.pageId, "pageId");
  const page = await updatePage(req.params.siteId, req.params.pageId, req.body);
  await auditEventFromRequest(req, { action: "page.updated", result: "success", siteId: req.params.siteId, metadata: { pageId: page.pageId } });
  res.json({ page });
}));
