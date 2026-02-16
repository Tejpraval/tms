/* --------------------------------------------
   Policy Core Types
--------------------------------------------- */

export interface Policy {
  _id: string;
  policyId: string;
  name?: string;
  releaseMode?: "DIRECT" | "ROLLOUT";
  releaseId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/* --------------------------------------------
   Policy Version
--------------------------------------------- */

export interface PolicyVersion {
  _id: string;
  policyId: string;
  version: number;
  rules: unknown;
  createdBy?: string;
  createdAt?: string;
}

/* --------------------------------------------
   Compare Result (engine output)
--------------------------------------------- */

export interface PolicyComparisonResult {
  summary: unknown;
  diffs: unknown;
}
