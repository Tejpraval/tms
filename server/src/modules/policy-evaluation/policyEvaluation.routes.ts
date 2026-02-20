//D:\resumeproject\server\src\modules\policy-evaluation
import { Router } from "express";
import { evaluatePolicyController } from "./policyEvaluation.controller";
import authMiddleware from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/requirePermission";
import { Permission } from "../../constants/permissions";

const router = Router();

router.use(authMiddleware);

router.post(
    "/evaluate",
    requirePermission(Permission.POLICY_READ),
    evaluatePolicyController
);

export default router;
