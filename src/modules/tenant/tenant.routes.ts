import { Router } from "express";
import  authMiddleware  from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/requirePermission";
import { enforceTenantScope } from "../../middleware/tenantScope";
import { Permission } from "../../constants/permissions";
import {
  getTenantById,
  createTenant,
  deleteTenant,
} from "./tenant.controller";
import { authorize } from "../../middleware/authorize";
import { canReadTenant } from "../../policies/tenant.policy";
import { Tenant } from "./tenant.model";

const router = Router();

router.get(
  "/:tenantId",
  authMiddleware,
  requirePermission(Permission.TENANT_READ),
  enforceTenantScope,
  getTenantById
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
