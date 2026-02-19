interface Inputs {
  stressScore: number;
  baseRiskScore: number;
  slaBreachPercentage: number;
  activeRollouts: number;
  volatility: number;
}

export const useStressDecomposition = ({
  stressScore,
  baseRiskScore,
  slaBreachPercentage,
  activeRollouts,
  volatility,
}: Inputs) => {
  if (stressScore === 0) {
    return {
      basePercent: 0,
      slaPercent: 0,
      rolloutPercent: 0,
      volatilityPercent: 0,
    };
  }

  // Raw weighted signals (tuneable model)
  const slaImpact = slaBreachPercentage * 0.6;
  const rolloutImpact = activeRollouts * 8;
  const volatilityImpact = volatility * 1.2;
  const baseImpact = baseRiskScore;

  const total =
    baseImpact +
    slaImpact +
    rolloutImpact +
    volatilityImpact;

  const normalize = (value: number) =>
    Math.round((value / total) * 100);

  return {
    basePercent: normalize(baseImpact),
    slaPercent: normalize(slaImpact),
    rolloutPercent: normalize(rolloutImpact),
    volatilityPercent: normalize(volatilityImpact),
  };
};
