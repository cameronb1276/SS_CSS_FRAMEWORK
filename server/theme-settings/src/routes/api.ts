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
    port: Number(process.env.PORT ?? 3004),
    timestamp: new Date().toISOString()
  });
});

apiRouter.get("/sites", asyncRoute(async (_req, res) => {
  res.json({ sites: await listSites() });
}));

apiRouter.post("/sites", asyncRoute(async (req, res) => {
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
  res.status(201).json({ settings });
}));

apiRouter.get("/sites/:siteId/settings", asyncRoute(async (req, res) => {
  res.json({ settings: await readSettings(req.params.siteId) });
}));

apiRouter.put("/sites/:siteId/settings", asyncRoute(async (req, res) => {
  validateSiteId(req.params.siteId);
  const update = validateSettingsUpdate(req.body);
  res.json({ settings: await updateSettings(req.params.siteId, update) });
}));

apiRouter.post("/sites/:siteId/rebuild-theme", asyncRoute(async (req, res) => {
  res.json({ theme: await rebuildThemeCss(req.params.siteId) });
}));

apiRouter.get("/sites/:siteId/theme", asyncRoute(async (req, res) => {
  res.json({ theme: await themeMetadata(req.params.siteId) });
}));

apiRouter.get("/sites/:siteId/custom-css", asyncRoute(async (req, res) => {
  res.json({ customCss: await readCustomCode(req.params.siteId, "css") });
}));

apiRouter.put("/sites/:siteId/custom-css", asyncRoute(async (req, res) => {
  const payload = validateCustomCssPayload(req.body);
  res.json({ customCss: await updateCustomCode(req.params.siteId, "css", payload.enabled, payload.content) });
}));

apiRouter.get("/sites/:siteId/custom-js", asyncRoute(async (req, res) => {
  res.json({ customJs: await readCustomCode(req.params.siteId, "js") });
}));

apiRouter.put("/sites/:siteId/custom-js", asyncRoute(async (req, res) => {
  const payload = validateCustomJsPayload(req.body);
  res.json({ customJs: await updateCustomCode(req.params.siteId, "js", payload.enabled, payload.content) });
}));
