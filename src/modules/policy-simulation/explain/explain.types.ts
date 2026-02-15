export interface ExplanationItem {
  type: "RBAC" | "ABAC" | "RISK";
  message: string;
}

export interface AuditStep {
  step: string;
  at: string;
}
