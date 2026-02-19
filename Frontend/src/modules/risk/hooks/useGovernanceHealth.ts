interface Inputs {
  history: number[];
  volatility: number;
  sustainedTrend: "STABLE" | "ESCALATING" | "DEESCALATING";
  tier: "STABLE" | "ELEVATED" | "CRITICAL";
}

export const useGovernanceHealth = ({
  history,
  volatility,
  sustainedTrend,
  tier,
}: Inputs) => {
  if (history.length === 0) {
    return {
      healthScore: 100,
      healthLabel: "EXCELLENT",
      healthColor: "text-green-400",
    };
  }

  const average =
    history.reduce((a, b) => a + b, 0) /
    history.length;

  let penalty = 0;

  // sustained critical state
  if (tier === "CRITICAL") penalty += 25;

  // volatility penalty
  if (volatility > 20) penalty += 15;

  // escalating trend penalty
  if (sustainedTrend === "ESCALATING") penalty += 10;

  // average stress penalty
  penalty += average * 0.4;

  const healthScore = Math.max(
    0,
    Math.round(100 - penalty)
  );

  let healthLabel = "GOOD";
  let healthColor = "text-yellow-400";

  if (healthScore > 85) {
    healthLabel = "EXCELLENT";
    healthColor = "text-green-400";
  } else if (healthScore > 60) {
    healthLabel = "GOOD";
    healthColor = "text-yellow-400";
  } else {
    healthLabel = "AT RISK";
    healthColor = "text-red-400";
  }

  return {
    healthScore,
    healthLabel,
    healthColor,
  };
};
