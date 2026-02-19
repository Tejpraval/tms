interface Inputs {
  baseStress: number;
  rolloutSize: number;       // % of tenants affected
  slaSensitivity: number;    // SLA breach %
  volatility: number;
}

export const useRolloutImpact = ({
  baseStress,
  rolloutSize,
  slaSensitivity,
  volatility,
}: Inputs) => {

  const rolloutPressure =
    rolloutSize * 0.4;

  const slaPressure =
    slaSensitivity * 0.3;

  const volatilityBoost =
    volatility * 0.2;

  const projectedStress =
    Math.min(
      100,
      Math.round(
        baseStress +
        rolloutPressure +
        slaPressure +
        volatilityBoost
      )
    );

  const delta =
    projectedStress - baseStress;

  const riskLevel =
    projectedStress > 80
      ? "HIGH"
      : projectedStress > 50
      ? "MODERATE"
      : "LOW";

  return {
    projectedStress,
    delta,
    riskLevel,
  };
};
