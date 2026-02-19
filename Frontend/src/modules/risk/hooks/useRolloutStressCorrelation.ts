interface Inputs {
  stressScore: number;
  volatility: number;     // stdDev
  momentum: number;
  activeRollouts: number;
}

export const useRolloutStressCorrelation = ({
  stressScore,
  volatility,
  momentum,
  activeRollouts,
}: Inputs) => {
  if (activeRollouts === 0) {
    return {
      rolloutImpactScore: 0,
      rolloutInfluencePercent: 0,
    };
  }

  // Rollout pressure model
  const pressure =
    activeRollouts *
    (volatility / 20) *
    (1 + Math.abs(momentum) / 50);

  const rolloutImpactScore = Math.min(
    pressure,
    stressScore
  );

  const rolloutInfluencePercent =
    stressScore > 0
      ? Math.min(
          Math.round(
            (rolloutImpactScore / stressScore) * 100
          ),
          100
        )
      : 0;

  return {
    rolloutImpactScore,
    rolloutInfluencePercent,
  };
};
