import { ExplanationItem } from "./explain.types";

export function explainRisk(factors: string[]): ExplanationItem[] {
  return factors.map(f => ({
    type: "RISK",
    message: f,
  }));
}
