// src/modules/policy-approval/execution.service.ts

import { PolicyApproval } from "./approval.model";
import { RBAC_MATRIX } from "../../constants/rbac";
import { Role } from "../../constants/roles";
import { Permission } from "../../constants/permissions";
import { ExecutionResult } from "./execution.types";

/**
 * Apply approved simulation to live system
 */
export async function executeApprovedPolicy(
  simulationId: string
): Promise<ExecutionResult> {
  const approval = await PolicyApproval.findOne({ simulationId }).exec();


  if (!approval) {
    throw new Error("Approval not found");
  }

  if (approval.status !== "APPROVED") {
    throw new Error("Policy not approved");
  }

  if (approval.executedAt) {
    return {
      executed: false,
      executedAt: approval.executedAt,
      message: "Policy already executed",
    };
  }

  /**
   * 🔹 RBAC execution example
   * (In production this would update DB-driven policy storage)
   */

  if (approval.metadata?.rbacChange) {
    const change = approval.metadata.rbacChange;

    RBAC_MATRIX[change.roleId as Role] = [
      ...change.permissions,
    ] as Permission[];
  }

  /**
   * 🔹 ABAC execution example
   * (Real implementation would update attribute store)
   */

  if (approval.metadata?.abacChange) {
    // Here you'd persist attribute changes
    // For now assume execution success
  }

  approval.executedAt = new Date();
  await approval.save();

  return {
    executed: true,
    executedAt: approval.executedAt,
    message: "Policy successfully executed",
  };
}
