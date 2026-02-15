// src/middleware/tenantScope.ts
import { Request, Response, NextFunction } from "express";

export const enforceTenantScope = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userTenantId = req.user?.tenantId;
  const targetTenantId = req.params.tenantId;

  if (!userTenantId || userTenantId !== targetTenantId) {
    return res.status(403).json({
      message: "Forbidden: tenant scope violation",
    });
  }

  next();
};
