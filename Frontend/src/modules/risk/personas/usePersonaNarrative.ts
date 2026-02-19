import type { RiskPersona } from "./types";

interface Inputs {
  persona: RiskPersona;
  stressScore: number;
  predictedNext: number;
}

export const usePersonaNarrative = ({
  persona,
  stressScore,
  predictedNext,
}: Inputs) => {
  if (persona === "CFO") {
    return {
      headline:
        stressScore > 80
          ? "Financial risk exposure increasing"
          : "Financial governance stable",
    };
  }

  if (persona === "CTO") {
    return {
      headline:
        predictedNext > stressScore
          ? "Technical risk trajectory accelerating"
          : "Technical stability improving",
    };
  }

  if (persona === "CISO") {
    return {
      headline:
        stressScore > 70
          ? "Compliance & breach surface expanding"
          : "Security posture controlled",
    };
  }

  return { headline: "" };
};
