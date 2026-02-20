import { Request, Response, NextFunction } from "express";
import { Permission } from "../constants/permissions";
import { RBAC_MATRIX } from "../constants/rbac";
import { Role } from "../constants/roles";
import { logAudit } from "../modules/audit/audit.service";
import { User } from "../modules/user/user.model";
import { Role as CustomRoleModel } from "../modules/role/role.model";

export const requirePermission =
  (permission: Permission) =>
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!user || !user.role) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let allowed = false;

      // Cache user permissions on req to avoid redundant N+1 DB queries per request
      if (!(req as any).userPermissionsCached) {
        try {
          // For SUPER_ADMIN there is no customRoleId, just use RBAC matrix
          if (user.role === 'SUPER_ADMIN') {
            (req as any).userPermissions = RBAC_MATRIX[user.role as Role] || [];
            (req as any).userPermissionsCached = true;
          } else {
            const dbUser = await User.findById(user.id).select('customRoleId').lean();
            if (dbUser && dbUser.customRoleId) {
              const cRole = await CustomRoleModel.findOne({ _id: dbUser.customRoleId, tenantId: user.tenantId }).lean();
              if (cRole) {
                (req as any).userPermissions = cRole.permissions || [];
              } else {
                return res.status(403).json({ message: "Forbidden: Custom role not found or invalid tenant scope" });
              }
            } else {
              (req as any).userPermissions = RBAC_MATRIX[user.role as Role] || [];
            }
            (req as any).userPermissionsCached = true;
          }
        } catch (e) {
          (req as any).userPermissions = RBAC_MATRIX[user.role as Role] || [];
          (req as any).userPermissionsCached = true;
        }
      }

      const permissions = (req as any).userPermissions as Permission[];
      allowed = permissions.includes(permission);

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
