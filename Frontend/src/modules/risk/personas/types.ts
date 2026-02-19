export type RiskPersona = "CFO" | "CTO" | "CISO";

export interface PersonaWeights {
  slaWeight: number;
  rolloutWeight: number;
  volatilityWeight: number;
}
