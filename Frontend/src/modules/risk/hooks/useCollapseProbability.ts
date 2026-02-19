import { useMemo } from "react";

interface Inputs {
  currentStress: number;
  momentum: number;
  volatility: number;
  threshold?: number;
  simulations?: number;
  days?: number;
}

export const useCollapseProbability = ({
  currentStress,
  momentum,
  volatility,
  threshold = 90,
  simulations = 200,
  days = 30,
}: Inputs) => {
  const probability = useMemo(() => {
    let breaches = 0;

    for (let s = 0; s < simulations; s++) {
      let simulated = currentStress;
      let breached = false;

      for (let d = 0; d < days; d++) {
        simulated += momentum * 0.3;

        const wave =
          Math.sin(d * 0.6 + s) *
          volatility *
          0.25;

        simulated += wave;

        if (simulated > threshold) {
          breached = true;
          break;
        }

        simulated = Math.max(0, Math.min(100, simulated));
      }

      if (breached) breaches++;
    }

    return Math.round((breaches / simulations) * 100);
  }, [currentStress, momentum, volatility, threshold, simulations, days]);

  const riskLevel =
    probability > 70
      ? "HIGH"
      : probability > 40
      ? "MODERATE"
      : "LOW";

  return {
    collapseProbability: probability,
    riskLevel,
  };
};
