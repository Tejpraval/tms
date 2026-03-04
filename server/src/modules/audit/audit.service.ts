import { AuditLog, IAuditLog } from "./audit.model";
import { Request } from "express";

/**
 * Audit tracking service
 */
class AuditService {
  /**
   * Create an audit log record immutably.
   */
  async createAuditLog(
    params: Pick<IAuditLog, "tenantId" | "userId" | "action" | "entityType" | "entityId" | "metadata">
  ): Promise<void> {
    try {
      const log = new AuditLog({
        tenantId: params.tenantId,
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadata: params.metadata || {},
      });

      // Saving securely triggers hooks making document fully unmodifiable
      await log.save();
    } catch (error) {
      console.error("Audit Service Save Error", error);
      // We intentionally swallow this error to avoid breaking application lifecycle
    }
  }

  /**
   * Fetch recent audit logs globally for a tenant.
   * Limits to last 50 queries correctly fetching desc sort
   */
  async getTenantAuditLogs(tenantId: string): Promise<IAuditLog[]> {
    return await AuditLog.find({ tenantId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(); // Faster query execution without returning instantiated Mongoose model methods
  }

  /**
   * Fetch global audit logs across all tenants with pagination.
   * Strictly for Super Admin platform views.
   */
  async getGlobalAuditLogs(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      AuditLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments()
    ]);

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    };
  }
}

export const auditService = new AuditService();

export const logAudit = async (params: {
  req: Request | any;
  action: string;
  resource: string;
  resourceId?: string;
  outcome?: string;
  reason?: string;
}) => {
  const req = params.req;
  const user = req?.user;

  // if no user, we might log as SYSTEM for login failures etc, but typically need tenantId
  const tenantId = user?.tenantId || (req?.params?.tenantId) || "SYSTEM";
  const userId = user?.id || "SYSTEM";

  // Map robustly to allowed enum types. Mongoose restricts to POLICY, VERSION, APPROVAL, ROLE, USER
  const allowedEntities = ["POLICY", "VERSION", "APPROVAL", "ROLE", "USER"];
  let entityType = params.resource;
  if (!allowedEntities.includes(entityType)) {
    entityType = "USER"; // fallback
  }

  const entityId = params.resourceId || tenantId || "UNKNOWN";

  await auditService.createAuditLog({
    tenantId,
    userId,
    action: params.action,
    entityType: entityType as any,
    entityId,
    metadata: {
      outcome: params.outcome,
      reason: params.reason,
      originalResource: params.resource
    }
  });
};
