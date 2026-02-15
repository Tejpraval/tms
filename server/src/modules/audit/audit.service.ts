import { AuditLog } from "./audit.model";
import { Request } from "express";

export async function logAudit({
  req,
  action,
  resource,
  resourceId,
  outcome,
  reason,
}: {
  req: Request;
  action: string;
  resource: string;
  resourceId?: string;
  outcome: "ALLOW" | "DENY";
  reason?: string;
}) {
  await AuditLog.create({
    actorId: req.user?.id,
    actorRole: req.user?.role,
    action,
    resource,
    resourceId,
    outcome,
    reason,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });
}
