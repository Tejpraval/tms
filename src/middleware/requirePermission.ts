import { Request, Response, NextFunction } from "express";
import { Permission } from "../constants/permissions";
import { RBAC_MATRIX } from "../constants/rbac";
import { Role } from "../constants/roles";
import { logAudit } from "../modules/audit/audit.service";

export const requirePermission =
  (permission: Permission) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const allowedPermissions = RBAC_MATRIX[user.role as Role];
    const allowed = allowedPermissions.includes(permission);

    if (!allowed) {
      await logAudit({
        req,
        action: permission,
        resource: "TENANT",
        outcome: "DENY",
        reason: "RBAC",
      });

      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
