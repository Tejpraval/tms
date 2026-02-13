import { Router } from "express";
import {
  createDraft,
  activate,
  rollback,
  compare,
  listVersions
} from "./policyVersion.controller";

import  authMiddleware  from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/requirePermission";
import { Permission } from "../../constants/permissions";

const router = Router();

/**
 * POST /policies/:id/draft
 */
router.post(
  "/:id/draft",
  authMiddleware,
  requirePermission(Permission.POLICY_WRITE),
  createDraft
);

/**
 * POST /policies/:id/activate/:version
 */
router.post(
  "/:id/activate/:version",
  authMiddleware,
  requirePermission(Permission.POLICY_APPROVE),
  activate
);

/**
 * POST /policies/:id/rollback/:version
 */
router.post(
  "/:id/rollback/:version",
  authMiddleware,
  requirePermission(Permission.POLICY_ADMIN),
  rollback
);

/**
 * GET /policies/:id/compare?v1=&v2=
 */
router.get(
  "/:id/compare",
  authMiddleware,
  requirePermission(Permission.POLICY_READ),
  compare
);

/**
 * GET /policies/:id/versions
 */
router.get(
  "/:id/versions",
  authMiddleware,
  requirePermission(Permission.POLICY_READ),
  listVersions
);

export default router;
