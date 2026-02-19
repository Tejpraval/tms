import { useState } from "react";
import type { RiskPersona, PersonaWeights } from "./types";

export const useRiskPersona = () => {
  const [persona, setPersona] = useState<RiskPersona>("CFO");

  const getWeights = (): PersonaWeights => {
    switch (persona) {
      case "CFO":
        return {
          slaWeight: 1.5,
          rolloutWeight: 0.7,
          volatilityWeight: 1.2,
        };
      case "CTO":
        return {
          slaWeight: 1.0,
          rolloutWeight: 1.5,
          volatilityWeight: 1.3,
        };
      case "CISO":
        return {
          slaWeight: 1.7,
          rolloutWeight: 1.2,
          volatilityWeight: 1.8,
        };
      default:
        return {
          slaWeight: 1,
          rolloutWeight: 1,
          volatilityWeight: 1,
        };
    }
  };

  return {
    persona,
    setPersona,
    weights: getWeights(),
  };
};
