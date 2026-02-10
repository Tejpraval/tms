//src/modules/policy-approval/approval.routes.ts 
import { Router, RequestHandler } from "express";
import {
  approveSimulation,
  rejectSimulation,
} from "./approval.controller";
import authMiddleware from "../../middleware/auth.middleware";

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

export default router;
