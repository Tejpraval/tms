import { useMemo } from "react";

interface Inputs {
  adjustedRiskScore: number;   // already multiplied
  slaBreachPercentage: number;
  activeRollouts: number;
}

export const useGovernanceStress = ({
  adjustedRiskScore,
  slaBreachPercentage,
  activeRollouts,
}: Inputs) => {
  return useMemo(() => {
    // Normalize risk (assume 0–100 baseline)
    const riskComponent = adjustedRiskScore;

    // SLA pressure weighted
    const slaComponent = slaBreachPercentage * 0.6;

    // Rollout pressure (light weight for now)
    const rolloutComponent =
      activeRollouts > 0 ? 10 : 0;

    const rawScore =
      riskComponent * 0.6 +
      slaComponent +
      rolloutComponent;

    const normalized = Math.min(
      Math.round(rawScore),
      100
    );

    let tier: "STABLE" | "ELEVATED" | "CRITICAL";

    if (normalized > 70) tier = "CRITICAL";
    else if (normalized > 35) tier = "ELEVATED";
    else tier = "STABLE";

    return {
      stressScore: normalized,
      stressTier: tier,
    };
  }, [adjustedRiskScore, slaBreachPercentage, activeRollouts]);
};
