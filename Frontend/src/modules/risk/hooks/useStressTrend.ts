import { useEffect, useReducer } from "react";

interface Inputs {
  currentStress: number;
  windowSize?: number;
}

type State = number[];

type Action =
  | { type: "ADD"; value: number; windowSize: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD": {
      const updated = [...state, action.value];
      return updated.slice(-action.windowSize);
    }
    default:
      return state;
  }
};

export const useStressTrend = ({
  currentStress,
  windowSize = 10,
}: Inputs) => {
  const [history, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    dispatch({
      type: "ADD",
      value: currentStress,
      windowSize,
    });
  }, [currentStress, windowSize]);

  // ---- Compute average FIRST ----
  const average =
    history.length > 0
      ? history.reduce((a, b) => a + b, 0) /
        history.length
      : 0;

  // ---- Then variance ----
  const variance =
    history.length > 0
      ? history.reduce(
          (sum, v) =>
            sum + Math.pow(v - average, 2),
          0
        ) / history.length
      : 0;

  const stdDev = Math.sqrt(variance);

  const first = history[0] ?? currentStress;
  const last =
    history[history.length - 1] ?? currentStress;

  const momentum = last - first;
   const slope =
  history.length > 1
    ? momentum / (history.length - 1)
    : 0;

const predictedNext = Math.round(
  last + slope
);
 const drift = momentum / Math.max(history.length - 1, 1);

const forecastSteps = 3;

const forecast: number[] = [];

let lastValue = history[history.length - 1] ?? currentStress;

for (let i = 0; i < forecastSteps; i++) {
  lastValue = Math.round(lastValue + drift);
  forecast.push(Math.max(0, lastValue));
}


  let sustainedTrend:
    | "STABLE"
    | "ESCALATING"
    | "DEESCALATING";

  if (momentum > 20) sustainedTrend = "ESCALATING";
  else if (momentum < -20)
    sustainedTrend = "DEESCALATING";
  else sustainedTrend = "STABLE";

  return {
    history,
    average: Math.round(average),
    momentum,
    sustainedTrend,
    stdDev,
    predictedNext,
    forecast,
  };
};
