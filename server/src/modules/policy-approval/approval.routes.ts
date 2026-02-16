//src/modules/policy-approval/approval.routes.ts 
import { Router, RequestHandler } from "express";
import {
  approveSimulation,
  rejectSimulation,
} from "./approval.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { executePolicy } from "./execution.controller";
import { listPendingApprovals } from "./approval.controller";
const router = Router();

// 🔑 Type adaptation layer (THIS is what was missing)
router.post(
  "/approve",
  authMiddleware,
  approveSimulation as RequestHandler
);

router.post(
  "/reject",
  authMiddleware,
  rejectSimulation as RequestHandler
);

router.post(
  "/execute",
  authMiddleware,
  executePolicy as RequestHandler
);

router.get(
  "/pending",
  authMiddleware,
  listPendingApprovals as RequestHandler
);


export default router;
