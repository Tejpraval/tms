import { useState, useMemo } from "react";

interface Inputs {
  baseStress: number;
  baseBreach: number;
  baseRollouts: number;
}

export const useStressSimulation = ({
  baseStress,
  baseBreach,
  baseRollouts,
}: Inputs) => {
  const [breachOverride, setBreachOverride] = useState<number | null>(null);
  const [rolloutOverride, setRolloutOverride] = useState<number | null>(null);

  const simulatedStress = useMemo(() => {
    const breach = breachOverride ?? baseBreach;
    const rollouts = rolloutOverride ?? baseRollouts;

    const breachImpact = breach * 0.6;
    const rolloutImpact = rollouts * 5;

    return Math.min(
      100,
      Math.round(baseStress + breachImpact + rolloutImpact)
    );
  }, [baseStress, breachOverride, rolloutOverride, baseBreach, baseRollouts]);

  return {
    simulatedStress,
    breachOverride,
    rolloutOverride,
    setBreachOverride,
    setRolloutOverride,
  };
};
