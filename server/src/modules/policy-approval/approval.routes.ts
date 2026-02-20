//src/modules/policy-approval/approval.routes.ts 
import { Router, RequestHandler } from "express";
import {
  approveSimulation,
  rejectSimulation,
} from "./approval.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { executePolicy } from "./execution.controller";
import { listPendingApprovals } from "./approval.controller";
import { requirePermission } from "../../middleware/requirePermission";
import { Permission } from "../../constants/permissions";

const router = Router();

// Apply authentication globally
router.use(authMiddleware);

router.post(
  "/approve",
  requirePermission(Permission.POLICY_APPROVE),
  approveSimulation as RequestHandler
);

router.post(
  "/reject",
  requirePermission(Permission.POLICY_APPROVE),
  rejectSimulation as RequestHandler
);

router.post(
  "/execute",
  requirePermission(Permission.POLICY_ADMIN),
  executePolicy as RequestHandler
);

router.get(
  "/pending",
  requirePermission(Permission.POLICY_READ),
  listPendingApprovals as RequestHandler
);

export default router;
