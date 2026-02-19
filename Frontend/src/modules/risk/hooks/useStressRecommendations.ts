interface Inputs {
  tier: "STABLE" | "ELEVATED" | "CRITICAL";
  predictedNext: number;
  momentum: number;
  slaPercent: number;
  rolloutPercent: number;
  volatilityPercent: number;
}

export const useStressRecommendations = ({
  tier,
  predictedNext,
  momentum,
  slaPercent,
  rolloutPercent,
  volatilityPercent,
}: Inputs) => {
  const recommendations: string[] = [];

  if (tier === "CRITICAL") {
    recommendations.push(
      "Immediately pause active policy rollouts."
    );
  }

  if (predictedNext > 90) {
    recommendations.push(
      "Escalate to governance oversight committee."
    );
  }

  if (slaPercent > 40) {
    recommendations.push(
      "Trigger SLA breach mitigation workflow."
    );
  }

  if (rolloutPercent > 30) {
    recommendations.push(
      "Reduce rollout concurrency to lower pressure."
    );
  }

  if (volatilityPercent > 30) {
    recommendations.push(
      "Investigate volatility spikes in approval cycle."
    );
  }

  if (
    tier === "STABLE" &&
    momentum < 5
  ) {
    recommendations.push(
      "System stable. Continue monitoring."
    );
  }

  return { recommendations };
};
