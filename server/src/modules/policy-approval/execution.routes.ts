// src/modules/policy-approval/execution.routes.ts

import { Router, RequestHandler } from "express";
import { executePolicy, getExecutionHistory } from "./execution.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/requirePermission";
import { Permission } from "../../constants/permissions";
import { withAudit } from "../audit/audit.middleware";

const router = Router();

router.use(authMiddleware);

router.post(
  "/execute",
  requirePermission(Permission.POLICY_ADMIN),
  withAudit("Execute Policy", (req) => ({ type: "POLICY", id: req.body?.policyId || "UNKNOWN" })),
  executePolicy as RequestHandler
);

router.get(
  "/:policyId/execution-history",
  requirePermission(Permission.POLICY_READ),
  getExecutionHistory as RequestHandler
);

export default router;
