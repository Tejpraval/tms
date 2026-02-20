//D:\resumeproject\server\src\modules\tenant\tenant.routes.ts
import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/requirePermission";
import { enforceTenantScope } from "../../middleware/tenantScope";
import { Permission } from "../../constants/permissions";
import {
  getTenantById,
  createTenant,
  deleteTenant,
  getAllTenants,
} from "./tenant.controller";
import { authorize } from "../../middleware/authorize";
import { canReadTenant } from "../../policies/tenant.policy";
import { Tenant } from "./tenant.model";
import { Request, Response, NextFunction } from "express";

const router = Router();

// router.get(
//   "/:tenantId",
//   authMiddleware,
//   requirePermission(Permission.TENANT_READ),
//   enforceTenantScope,
//   getTenantById
// );

const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Super Admin access required" });
  }
  next();
};

router.get(
  "/",
  authMiddleware,
  requireSuperAdmin,
  requirePermission(Permission.TENANT_READ),
  getAllTenants
);

router.post(
  "/",
  authMiddleware,
  requirePermission(Permission.TENANT_CREATE),
  createTenant
);

router.delete(
  "/:tenantId",
  authMiddleware,
  requirePermission(Permission.TENANT_DELETE),
  deleteTenant
);
router.get(
  "/:tenantId",
  authMiddleware,
  requirePermission(Permission.TENANT_READ),
  authorize(
    async (req) =>
      Tenant.findById(req.params.tenantId).lean().then(t => ({
        tenantId: t!._id.toString(),
      })),
    canReadTenant
  ),
  getTenantById
);

export default router; // 👈 THIS MUST EXIST
