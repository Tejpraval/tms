import { Router, Request, Response, NextFunction } from "express";
import { auditService } from "./audit.service";
import authMiddleware from "../../middleware/auth.middleware";

const router = Router();
const requireStrictSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "SUPER_ADMIN" || (req.user as any)?.impersonating) {
        return res.status(403).json({ message: "Strict Super Admin access required" });
    }
    next();
};

// Global telemetry for Super Admins
router.get("/global", authMiddleware, requireStrictSuperAdmin, async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;
        const result = await auditService.getGlobalAuditLogs(page, limit);
        res.json(result);
    } catch (error) {
        console.error("Global Audit Fetching Failed:", error);
        res.status(500).json({ error: "Failed to fetch global audit logs" });
    }
});

// Define exactly what the instruction needs
router.get("/recent", async (req: Request, res: Response): Promise<void> => {
    try {
        const tenantId = ((req as any).user?.tenant || "SYSTEM"); // Retrieve per standard auth frameworks
        const logs = await auditService.getTenantAuditLogs(tenantId);

        res.json({ logs });
    } catch (error) {
        console.error("Audit Fetching Failed:", error);
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});

export default router;
