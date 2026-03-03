import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { getGovernanceAnalytics } from "./governance-dashboard.controller";
import { requirePermission } from "../../middleware/requirePermission";
import { Permission } from "../../constants/permissions";

const router = Router();

router.use(authMiddleware);

router.get(
    "/analytics",
    requirePermission(Permission.POLICY_READ),
    getGovernanceAnalytics
);

export default router;
