//src/modules/policy-approval/approval.routes.ts 
import { Router, RequestHandler } from "express";
import {
  approveSimulation,
  rejectSimulation,
} from "./approval.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { executePolicy } from "./execution.controller";

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


export default router;
