interface Inputs {
  stressScore: number;
  tier: "STABLE" | "ELEVATED" | "CRITICAL";
  momentum: number;
  slaPercent: number;
  rolloutPercent: number;
  volatilityPercent: number;
  isAlerting: boolean;
}

export const useStressNarrative = ({
//   stressScore,
  tier,
  momentum,
  slaPercent,
  rolloutPercent,
  volatilityPercent,
  isAlerting,
}: Inputs) => {
  const dominant = Math.max(
    slaPercent,
    rolloutPercent,
    volatilityPercent
  );

  let driver = "base risk conditions";

  if (dominant === slaPercent) driver = "SLA breaches";
  if (dominant === rolloutPercent) driver = "active rollouts";
  if (dominant === volatilityPercent) driver = "volatility acceleration";

  const direction =
    momentum > 5
      ? "accelerating"
      : momentum < -5
      ? "cooling"
      : "stable";

  const severity =
    tier === "CRITICAL"
      ? "high governance pressure"
      : tier === "ELEVATED"
      ? "elevated operational risk"
      : "stable conditions";

  let narrative = `System experiencing ${severity}, primarily driven by ${driver}. Trend is currently ${direction}.`;

  if (isAlerting) {
    narrative +=
      " Forecast indicates potential breach of critical threshold.";
  }

  return { narrative };
};
