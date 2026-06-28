import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminApiToken, isLocalDevelopmentMode, isProductionMode, publicThemeReadEnabled } from "../config";
import { validateSiteId } from "../validation/siteId";
import { ApiError } from "../utils/errors";
import { auditEventFromRequest } from "../services/auditLog";

export type AccessAction =
  | "list-sites"
  | "create-site"
  | "read-settings"
  | "update-settings"
  | "rebuild-theme"
  | "read-theme"
  | "read-custom-css"
  | "update-custom-css"
  | "read-custom-js"
  | "update-custom-js"
  | "read-pages"
  | "create-page"
  | "read-page"
  | "update-page"
  | "validate-page"
  | "publish-site"
  | "read-publish";

type Actor = {
  id: string;
  authenticated: boolean;
  role: "local-dev-admin" | "api-admin" | "anonymous";
};

function bearerToken(req: Request): string | undefined {
  const header = req.get("authorization");
  if (!header?.startsWith("Bearer ")) return undefined;
  const token = header.slice("Bearer ".length).trim();
  return token ? token : undefined;
}

function resolveActor(req: Request): Actor {
  if (isLocalDevelopmentMode()) {
    return { id: "local-dev-admin", authenticated: true, role: "local-dev-admin" };
  }

  const configuredToken = adminApiToken();
  const token = bearerToken(req);
  if (configuredToken && token === configuredToken) {
    return { id: "api-admin", authenticated: true, role: "api-admin" };
  }

  return { id: "anonymous", authenticated: false, role: "anonymous" };
}

function canAccessSite(actor: Actor, action: AccessAction, siteId?: string): boolean {
  if (action === "read-theme" && publicThemeReadEnabled()) return true;
  if (!actor.authenticated) return false;
  if (siteId) validateSiteId(siteId);
  return actor.role === "local-dev-admin" || actor.role === "api-admin";
}

export function requireAccess(action: AccessAction, siteIdFromRequest?: (req: Request) => string | undefined): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const siteId = siteIdFromRequest?.(req);
    try {
      const actor = resolveActor(req);
      res.locals.actor = actor.id;
      if (isProductionMode() && !adminApiToken() && action !== "read-theme") {
        void auditEventFromRequest(req, { action: "auth.failure", result: "failure", siteId, status: 401, reason: "ADMIN_API_TOKEN is not configured in production mode." });
        next(new ApiError(401, "Production mode requires ADMIN_API_TOKEN for admin API access."));
        return;
      }
      if (!canAccessSite(actor, action, siteId)) {
        void auditEventFromRequest(req, { action: "access.denied", result: "failure", siteId, status: 403, reason: action });
        next(new ApiError(actor.authenticated ? 403 : 401, actor.authenticated ? "Access denied for this site." : "Authentication required."));
        return;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
