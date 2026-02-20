//D:\resumeproject\Frontend\src\modules\policy-versioning\types.ts
/* --------------------------------------------
   Policy Core Types
--------------------------------------------- */

export interface Policy {
  _id: string;
  policyId: string;
  name?: string;

  activeVersion: number;
  latestVersion: number;

  releaseMode: "STATIC" | "ROLLOUT";

  releaseId?: string | null;

  createdAt?: string;
  updatedAt?: string;
  metadata?: {
    policyId: string;
    activeVersion: number;
  };
}


/* --------------------------------------------
   Policy Version
--------------------------------------------- */
export type PolicyVersionStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "rolled_back";


export interface PolicyVersion {
  _id: string;
  policyId: string;
  version: number;
  status: PolicyVersionStatus;
  rules: unknown;

  parentVersion?: number;

  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  activatedAt?: string;

  createdAt: string;
  updatedAt?: string;
}

/* --------------------------------------------
   Compare Result (engine output)
--------------------------------------------- */

export interface PolicyComparisonResult {
  summary: unknown;
  diffs: unknown;
}
