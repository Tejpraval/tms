// src/modules/policy-approval/execution.routes.ts

import { Router, RequestHandler } from "express";
import { executePolicy } from "./execution.controller";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/execute",
  authMiddleware,
  executePolicy as RequestHandler
);

export default router;

