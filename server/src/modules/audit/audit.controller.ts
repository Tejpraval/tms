//D:\resumeproject\server\src\modules\audit\audit.controller.ts
import { RequestHandler } from "express";
import { AuditLog } from "./audit.model";

export const listRecentAudit: RequestHandler = async (
  req,
  res
) => {
  try {
    const audits = await AuditLog.find()
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
