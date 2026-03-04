import { Request, Response, NextFunction } from 'express';
import { Tenant } from '../modules/tenant/tenant.model';

export const enforceTenantActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = req.user?.role;
        const tenantId = req.user?.tenantId;

        // Super Admin platform routes bypass this (they can manage suspended tenants)
        if (userRole === 'SUPER_ADMIN') {
            return next();
        }

        if (!tenantId) {
            return res.status(403).json({ message: "No tenant context provided" });
        }

        const tenant = await Tenant.findById(tenantId).select('status').lean();

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        if (tenant.status === 'SUSPENDED') {
            return res.status(403).json({ message: "This tenant workspace has been suspended by the platform administrator." });
        }

        next();
    } catch (error) {
        console.error("enforceTenantActive error:", error);
        res.status(500).json({ message: "Internal Server Error during tenant validation" });
    }
};
