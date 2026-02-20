export const APPROVAL_SLA_CONFIG = {
  thresholdHours: 24,        // breach after 24h
  warningHours: 12,          // early warning
  criticalHours: 48,         // critical aging
  riskMultiplierCap: 4.0,    // max amplification factor
} as const;
