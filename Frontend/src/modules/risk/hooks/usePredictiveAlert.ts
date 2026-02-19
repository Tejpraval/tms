interface Inputs {
  predictedNext: number;
  threshold?: number;
}

export const usePredictiveAlert = ({
  predictedNext,
  threshold = 90,
}: Inputs) => {
  const isAlerting = predictedNext >= threshold;

  return {
    isAlerting,
  };
};
