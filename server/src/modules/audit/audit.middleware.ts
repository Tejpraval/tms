import { Request, Response, NextFunction } from "express";
import { auditService } from "./audit.service";
import mongoose from "mongoose";

/**
 * Audit tracking middleware
 * Hooks into express response 'finish' event to determine success
 * and fires-and-forgets the audit log asynchronously avoiding latency blocking.
 *
 * @param actionName The conceptual action name e.g. "Create Policy"
 * @param entityResolver Function deriving the affected entity type and ID based on final response/req data
 */
export const withAudit = (
    actionName: string,
    entityResolver: (req: Request, res: Response) => { type: "POLICY" | "VERSION" | "APPROVAL" | "ROLE" | "USER"; id: string; meta?: any }
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Listen to the response finishing
        res.on("finish", async () => {
            // Only audit successful modifications (we assume >=200 <400 means success usually)
            if (res.statusCode >= 200 && res.statusCode < 400) {
                try {
                    // Resolve standard info. Fallbacks for missing IDs to prevent crash.
                    // Note: requires req.user / req.tenantId to exist, typical in generic auth frameworks

                    let tenantId = (req as any).tenantId || (req as any).user?.tenant || "SYSTEM";
                    let userId = (req as any).user?.id || (req as any).user?._id?.toString() || "SYSTEM";

                    const { type, id, meta } = entityResolver(req, res);

                    // Verify if the string looks like an Object Id otherwise use 'SYSTEM_' defaults based on architecture design 
                    // (assuming standard strings are okay). Let's log.
                    await auditService.createAuditLog({
                        tenantId,
                        userId,
                        action: actionName,
                        entityType: type,
                        entityId: id,
                        metadata: meta || {}
                    });

                } catch (error) {
                    // Fire and forget means we explicitly swallow audit errors to avoid hurting the application flow,
                    // but we log it to console.
                    console.error("Audit Logging Failed:", error);
                }
            }
        });

        // Pass control downstream
        next();
    };
};
