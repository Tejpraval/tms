//D:\resumeproject\server\src\modules\audit\audit.controller.ts
import { RequestHandler } from "express";
import { AuditLog } from "./audit.model";

export const listRecentAudit: RequestHandler = async (
  req,
  res
) => {
  try {
    const query: any = {};
    if (req.user?.role !== "SUPER_ADMIN" && req.user?.tenantId) {
      query.tenantId = req.user.tenantId;
    }

    const audits = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({
      success: true,
      data: audits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};
