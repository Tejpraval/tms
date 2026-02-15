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
  const isAutoApproved = input.risk.severity === "LOW";

  const approval = await PolicyApproval.create({
    tenantId: input.tenantId,
    simulationId: input.simulationId,

    riskScore: input.risk.score,
    riskSeverity: input.risk.severity,

    status: isAutoApproved ? "APPROVED" : "PENDING",
    decidedBy: isAutoApproved ? "SYSTEM" : undefined,
    decidedAt: isAutoApproved ? new Date() : undefined,

    // 🔥 THIS FIXES EVERYTHING
    metadata: {
      policyId: input.policyId,
      version: input.version,
    },
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
    throw new Error(
      `Only ${requiredRole} can decide ${approval.riskSeverity} risk changes`
    );
  }

  approval.status = input.decision === "APPROVE" ? "APPROVED" : "REJECTED";
  approval.decidedBy = input.actorRole;
  approval.decidedAt = new Date();

  await approval.save();

  return approval;
}
