import type { Approval } from "./types";
import { APPROVAL_SLA_CONFIG } from "./sla.config";

export type ApprovalSeverity =
  | "HEALTHY"
  | "WARNING"
  | "BREACH"
  | "CRITICAL";

export interface ApprovalSlaMetrics {
  total: number;
  averageAgeHours: number;
  breachCount: number;
  breachPercentage: number;
  severityDistribution: Record<ApprovalSeverity, number>;
  riskAmplificationFactor: number;
}

const hoursSince = (date: string) =>
  (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);

const classifySeverity = (age: number): ApprovalSeverity => {
  const { warningHours, thresholdHours, criticalHours } =
    APPROVAL_SLA_CONFIG;

  if (age >= criticalHours) return "CRITICAL";
  if (age >= thresholdHours) return "BREACH";
  if (age >= warningHours) return "WARNING";
  return "HEALTHY";
};

export const calculateApprovalSlaMetrics = (
  approvals: Approval[]
): ApprovalSlaMetrics => {
  if (!approvals.length) {
    return {
      total: 0,
      averageAgeHours: 0,
      breachCount: 0,
      breachPercentage: 0,
      severityDistribution: {
        HEALTHY: 0,
        WARNING: 0,
        BREACH: 0,
        CRITICAL: 0,
      },
      riskAmplificationFactor: 1,
    };
  }

  const distribution: Record<ApprovalSeverity, number> = {
    HEALTHY: 0,
    WARNING: 0,
    BREACH: 0,
    CRITICAL: 0,
  };

  let totalAge = 0;
  let breachCount = 0;

  approvals.forEach((approval) => {
    const age = hoursSince(approval.createdAt);
    totalAge += age;

    const severity = classifySeverity(age);
    distribution[severity]++;

    if (severity === "BREACH" || severity === "CRITICAL") {
      breachCount++;
    }
  });

  const averageAgeHours = totalAge / approvals.length;
  const breachPercentage =
    (breachCount / approvals.length) * 100;

  // Non-linear amplification (aging stress curve)
  const amplification =
    1 +
    Math.min(
      breachPercentage / 100,
      APPROVAL_SLA_CONFIG.riskMultiplierCap - 1
    );

  return {
    total: approvals.length,
    averageAgeHours,
    breachCount,
    breachPercentage,
    severityDistribution: distribution,
    riskAmplificationFactor: amplification,
  };
};
