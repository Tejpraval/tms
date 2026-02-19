import { useMemo } from "react";

interface Inputs {
  currentStress: number;
  momentum: number;
  volatility: number;
  days?: number;
}

export const useRiskForecastTimeline = ({
  currentStress,
  momentum,
  volatility,
  days = 30,
}: Inputs) => {
  const forecast = useMemo(() => {
    const values: number[] = [];
    let simulated = currentStress;

    for (let i = 0; i < days; i++) {
      // Momentum continuation
      simulated += momentum * 0.3;

      // Deterministic volatility curve (sin wave instead of random)
      const wave =
        Math.sin(i * 0.6) *
        volatility *
        0.25;

      simulated += wave;

      // Regression gravity
      if (simulated > 70) simulated -= 0.5;
      if (simulated < 30) simulated += 0.3;

      simulated = Math.max(0, Math.min(100, simulated));

      values.push(Math.round(simulated));
    }

    return values;
  }, [currentStress, momentum, volatility, days]);

  const finalProjection =
    forecast[forecast.length - 1] ?? currentStress;

  const riskDirection =
    finalProjection > currentStress
      ? "ESCALATING"
      : finalProjection < currentStress
      ? "DECLINING"
      : "STABLE";

  return {
    forecast,
    finalProjection,
    riskDirection,
  };
};
