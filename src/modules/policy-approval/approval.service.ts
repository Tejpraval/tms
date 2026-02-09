import { PolicyApproval } from "./approval.model";
import { ApprovalActorRole } from "./approval.types";

export async function createApprovalFromSimulation(input: {
  tenantId: string;
  simulationId: string;
  risk: {
    score: number;
    severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  };
}) {
  // 🔹 Hybrid auto-approval rule
  const isAutoApproved = input.risk.severity === "LOW";

  const approval = await PolicyApproval.create({
    tenantId: input.tenantId,
    simulationId: input.simulationId,

    riskScore: input.risk.score,
    riskSeverity: input.risk.severity,

    status: isAutoApproved ? "APPROVED" : "PENDING",
    decidedBy: isAutoApproved ? "SYSTEM" : undefined,
    decidedAt: isAutoApproved ? new Date() : undefined,
  });

  return approval;
}
