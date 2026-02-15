//D:\resumeproject\server\src\modules\policy-simulation\risk\risk.types.ts
export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskResult {
  score: number;
  severity: RiskSeverity;
  factors: string[];
}

