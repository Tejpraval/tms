//D:\resumeproject\server\src\modules\policy-versioning\policyRelease.routes.ts
import { Router } from "express";
import {
  createRelease,
  expandRelease,
  rollbackReleaseHandler,
  updateReleaseStatus,
} from "./policyRelease.controller";
import { listActiveReleases } from "./policyRelease.controller";
import { getReleaseByPolicy } from "./policyRelease.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/requirePermission";
import { Permission } from "../../constants/permissions";

const router = Router();

// Apply authentication globally to all release routes
router.use(authMiddleware);

router.post(
  "/",
  requirePermission(Permission.POLICY_ADMIN),
  createRelease
);

router.post(
  "/:id/expand",
  requirePermission(Permission.POLICY_ADMIN),
  expandRelease
);

router.post(
  "/:id/rollback",
  requirePermission(Permission.POLICY_ADMIN),
  rollbackReleaseHandler
);

router.get(
  "/active",
  requirePermission(Permission.POLICY_READ),
  listActiveReleases
);

router.get(
  "/policy/:policyId",
  requirePermission(Permission.POLICY_READ),
  getReleaseByPolicy
);

router.post(
  "/:id/status",
  requirePermission(Permission.POLICY_ADMIN),
  updateReleaseStatus
);

export default router;
