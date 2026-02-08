import { Router } from "express";
import { simulatePolicyController } from "./simulation.controller";

import { authMiddleware } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/requirePermission";
import { Permission } from "../../constants/permissions";

const router = Router();

/**
 * Simulate policy changes
 */
router.post(
  "/simulate",
  authMiddleware,
  requirePermission(Permission.USER_MANAGE),
  simulatePolicyController
);

export default router;
