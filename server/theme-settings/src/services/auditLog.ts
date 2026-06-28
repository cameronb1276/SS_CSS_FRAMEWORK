import fs from "node:fs/promises";
import path from "node:path";
import { Request } from "express";
import { dataRoot } from "./paths";

type AuditResult = "success" | "failure";

export type AuditEvent = {
  action: string;
  result: AuditResult;
  siteId?: string;
  actor?: string;
  status?: number;
  reason?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

function actorFromRequest(req: Request): string {
  return resLocalsActor(req) ?? "anonymous";
}

function resLocalsActor(req: Request): string | undefined {
  const actor = req.res?.locals?.actor;
  return typeof actor === "string" ? actor : undefined;
}

export async function writeAuditEvent(event: AuditEvent): Promise<void> {
  const auditDir = path.join(dataRoot(), "audit");
  await fs.mkdir(auditDir, { recursive: true });
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...event
  });
  await fs.appendFile(path.join(auditDir, "audit.log"), `${line}\n`, "utf8");
}

export function auditEventFromRequest(req: Request, event: Omit<AuditEvent, "actor">): Promise<void> {
  return writeAuditEvent({ actor: actorFromRequest(req), ...event });
}
