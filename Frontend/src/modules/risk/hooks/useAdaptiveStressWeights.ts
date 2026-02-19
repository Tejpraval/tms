interface Inputs {
  history: number[];
  slaPercent: number;
  rolloutPercent: number;
  volatilityPercent: number;
}

export const useAdaptiveStressWeights = ({
  history,
  slaPercent,
  rolloutPercent,
  volatilityPercent,
}: Inputs) => {
  const spike =
    history.length > 1
      ? history[history.length - 1] -
        history[history.length - 2]
      : 0;

  let slaWeight = 1;
  let rolloutWeight = 1;
  let volatilityWeight = 1;

  if (spike > 10 && volatilityPercent > 25) {
    volatilityWeight = 1.3;
  }

  if (slaPercent > 40) {
    slaWeight = 1.2;
  }

  if (rolloutPercent > 35) {
    rolloutWeight = 1.2;
  }

  const total =
    slaWeight + rolloutWeight + volatilityWeight;

  return {
    slaWeight: slaWeight / total,
    rolloutWeight: rolloutWeight / total,
    volatilityWeight: volatilityWeight / total,
  };
};
