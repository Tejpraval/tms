import { Router } from "express";
import { Permission } from "../../constants/permissions";
import { requirePermission } from "../../middleware/requirePermission";
import authMiddleware from "../../middleware/auth.middleware";
import {
  listPolicies,
  getPolicyById,
  createPolicy,
  createDraft,
  activate,
  rollback,
  compare,
  listVersions
} from "./policyVersion.controller";

const router = Router();

// Apply authentication globally to all versioning routes
router.use(authMiddleware);

/**
 * POST /policies/
 * ROOT Creation Foundation Endpoint
 */
router.post(
  "/",
  requirePermission(Permission.POLICY_WRITE),
  createPolicy
);

/**
 * POST /policies/:id/draft
 */
router.post(
  "/:id/draft",
  requirePermission(Permission.POLICY_WRITE),
  createDraft
);

/**
 * POST /policies/:id/activate/:version
 */
router.post(
  "/:id/activate/:version",
  requirePermission(Permission.POLICY_APPROVE),
  activate
);

/**
 * POST /policies/:id/rollback/:version
 */
router.post(
  "/:id/rollback/:version",
  requirePermission(Permission.POLICY_ADMIN),
  rollback
);

/**
 * GET /policies/:id/compare?v1=&v2=
 */
router.get(
  "/:id/compare",
  requirePermission(Permission.POLICY_READ),
  compare
);

/**
 * GET /policies/:id/versions
 */
router.get(
  "/:id/versions",
  requirePermission(Permission.POLICY_READ),
  listVersions
);

router.get(
  "/",
  requirePermission(Permission.POLICY_READ),
  listPolicies
);

router.get(
  "/:id",
  requirePermission(Permission.POLICY_READ),
  getPolicyById
);

export default router;
