//D:\resumeproject\server\src\modules\policy-simulation\risk\risk.scorer.ts
import { PERMISSION_RISK } from "./permission.weights";
import { RiskResult } from "./risk.types";

export function scorePolicyRisk(input: {
  rbacDiffs?: Record<
    string,
    { gained: string[]; lost: string[] }
  >;
  abacChanges?: {
    action: string;
    from: "ALLOW" | "DENY";
    to: "ALLOW" | "DENY";
  }[];
}): RiskResult {
  let score = 0;
  const factors: string[] = [];

  // RBAC
  if (input.rbacDiffs) {
    const users = Object.keys(input.rbacDiffs).length;
    for (const diff of Object.values(input.rbacDiffs)) {
      for (const perm of diff.gained) {
        score += PERMISSION_RISK[perm] ?? 5;
        factors.push(`RBAC gain: ${perm}`);
      }
    }
    if (users > 1) {
      score += users * 5;
      factors.push(`RBAC affects ${users} users`);
    }
  }

  // ABAC
  if (input.abacChanges) {
    for (const d of input.abacChanges) {
      if (d.from === "DENY" && d.to === "ALLOW") {
        score += 25;
        factors.push(`ABAC escalation: ${d.action}`);
      }
    }
  }

  return {
    score,
    severity: classify(score),
    factors,
  };
}

function classify(score: number) {
  if (score >= 80) return "CRITICAL";
  if (score >= 50) return "HIGH";
  if (score >= 20) return "MEDIUM";
  return "LOW";
}
