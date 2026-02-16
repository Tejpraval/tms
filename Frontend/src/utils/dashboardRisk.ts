export interface DashboardRiskInput {
  pendingApprovals: number;
  activeRollouts: number;
  totalPolicies: number;
}

export interface DashboardRiskOutput {
  score: number;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export const calculateDashboardRisk = (
  input: DashboardRiskInput
): DashboardRiskOutput => {
  const { pendingApprovals, activeRollouts } = input;

  let score = 0;

  score += pendingApprovals * 10;
  score += activeRollouts * 15;

  if (score > 100) score = 100;

  let severity: DashboardRiskOutput["severity"] = "LOW";

  if (score >= 75) severity = "CRITICAL";
  else if (score >= 50) severity = "HIGH";
  else if (score >= 25) severity = "MEDIUM";

  return { score, severity };
};
