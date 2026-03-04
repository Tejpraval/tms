import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware";
import { getGovernanceOverview } from "./superAdmin.controller";

const router = Router();

// Strict Super Admin Guard
const requireSuperAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== "SUPER_ADMIN" || req.user?.impersonating) {
        return res.status(403).json({ message: "Platform access denied" });
    }
    next();
};

router.use(authMiddleware, requireSuperAdmin);

router.get("/governance-overview", getGovernanceOverview);

export default router;
