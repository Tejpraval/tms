import { useState } from "react";

interface Inputs {
  history: number[];
}

export const useStressReplay = ({ history }: Inputs) => {
  const [index, setIndex] = useState<number | null>(null);

  const isReplaying = index !== null;

  const replayedStress =
    index !== null ? history[index] : null;

  const maxIndex = history.length - 1;

  return {
    isReplaying,
    replayedStress,
    index,
    setIndex,
    maxIndex,
  };
};
