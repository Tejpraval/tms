//D:\resumeproject\Frontend\src\modules\rollout\types.ts
export type ReleaseStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "ROLLED_BACK";

export interface PolicyRelease {
  _id: string;
  tenantId: string;
  policyId: string;

  baseVersionId: string;
  candidateVersionId: string;

  rolloutPercentage: number;
  status: ReleaseStatus;

  anomalyScore?: number;

  stages: number[];
  currentStageIndex: number;
  lastEvaluatedAt?: string;
  autoMode: boolean;

  expansionHistory: {
    percentage: number;
    expandedAt: string;
    riskScoreSnapshot: number;
  }[];

  createdAt: string;
  updatedAt: string;
}


