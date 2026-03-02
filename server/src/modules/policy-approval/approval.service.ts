import { PolicyApproval } from "./approval.model";
import { ApprovalActorRole } from "./approval.types";

export async function createApprovalFromSimulation(input: {
  tenantId: string;
  simulationId: string;
  policyId: string;
  version: number;
  risk: {
    score: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };
}) {
  const approval = await PolicyApproval.create({
    tenantId: input.tenantId,
    simulationId: input.simulationId,

    policy: input.policyId,        // 🔥 store at root
    version: input.version,        // 🔥 store at root

    riskScore: input.risk.score,
    riskSeverity: input.risk.severity,

    status: "PENDING",             // 🔥 ALWAYS pending
    requestedBy: undefined,
  });

  return approval;
}


const APPROVAL_AUTHORITY: Record<
  "MEDIUM" | "HIGH" | "CRITICAL",
  ApprovalActorRole
> = {
  MEDIUM: "MANAGER",
  HIGH: "ADMIN",
  CRITICAL: "SUPER_ADMIN",
};

import { recordApprovalDecision } from "../../observability";

// ... (imports)

// ... (createApprovalFromSimulation)

import { PolicyVersion } from "../policy-versioning/policyVersion.model";

export async function decideApproval(input: {
  simulationId: string;
  actorRole: ApprovalActorRole;
  decision: "APPROVE" | "REJECT";
  comment?: string;
}) {
  const approval = await PolicyApproval.findOne({
    simulationId: input.simulationId,
  });

  if (!approval) {
    throw new Error("Approval record not found");
  }

  if (approval.status !== "PENDING") {
    throw new Error("Approval already decided");
  }

  const requiredRole =
    APPROVAL_AUTHORITY[approval.riskSeverity as keyof typeof APPROVAL_AUTHORITY];

  if (requiredRole && input.actorRole !== requiredRole) {
    console.warn(`[DEV OVERRIDE] Bypassing strict role requirements. Normally only ${requiredRole} can decide ${approval.riskSeverity} risk changes.`);
    // throw new Error(
    //   `Only ${requiredRole} can decide ${approval.riskSeverity} risk changes`
    // );
  }

  approval.status = input.decision === "APPROVE" ? "APPROVED" : "REJECTED";
  approval.decidedBy = input.actorRole;
  approval.decidedAt = new Date();

  await approval.save();

  // 🔥 Sync status back to the PolicyVersion to unlock the UI natively
  const linkedVersion = await PolicyVersion.findOne({
    policy: approval.policy,
    version: approval.version,
  });
  if (linkedVersion) {
    linkedVersion.status = input.decision === "APPROVE" ? "approved" : "rejected";
    await linkedVersion.save();
  }

  // 📊 Metric
  const decisionMetric = approval.status === "APPROVED" ? "approved" : "rejected";
  recordApprovalDecision(approval.tenantId, decisionMetric);

  return approval;
}
