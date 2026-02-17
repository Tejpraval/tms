import { useEffect, useRef, useState } from "react";

interface Inputs {
  currentStress: number;
}

export const useStressVolatility = ({
  currentStress,
}: Inputs) => {
  const previousStress = useRef<number | null>(null);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
   if (previousStress.current === null) {
  previousStress.current = currentStress;
  return;
}

setDelta(currentStress - previousStress.current);
previousStress.current = currentStress;


   
  }, [currentStress]);

  let trend: "STABLE" | "RISING" | "SPIKING";

  if (delta > 25) trend = "SPIKING";
  else if (delta > 10) trend = "RISING";
  else trend = "STABLE";

  return {
    delta,
    trend,
  };
};
