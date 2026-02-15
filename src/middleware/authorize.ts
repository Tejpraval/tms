import { Request, Response, NextFunction } from "express";
import { logAudit } from "../modules/audit/audit.service";

export const authorize =
  <R>(
    getResource: (req: Request) => Promise<R>,
    policy: (args: { user: any; resource: R }) => boolean
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const resource = await getResource(req);
    const allowed = policy({ user: req.user, resource });

    if (!allowed) {
      const resourceId =
        typeof req.params.tenantId === "string"
          ? req.params.tenantId
          : undefined;

      await logAudit({
        req,
        action: "ABAC_CHECK",
        resource: "TENANT",
        resourceId,
        outcome: "DENY",
        reason: "ABAC",
      });

      return res.status(403).json({ message: "Forbidden by policy" });
    }

    next();
  };
