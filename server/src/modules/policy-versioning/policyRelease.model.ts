//D:\resumeproject\server\src\modules\policy-versioning\policyRelease.model.ts
import mongoose, { Schema, Document } from "mongoose";

export type ReleaseStatus =
  | "DRAFT"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "ROLLED_BACK";

export interface PolicyReleaseDocument extends Document {
  tenantId: string;
  policyId: string;

  baseVersionId: string;
  candidateVersionId: string;

  rolloutPercentage: number;
  status: ReleaseStatus;

  anomalyScore?: number;

  // ✅ Automated Rollout Fields
  stages: number[];
  currentStageIndex: number;
  lastEvaluatedAt?: Date;
  autoMode: boolean;

  expansionHistory: {
    percentage: number;
    expandedAt: Date;
    riskScoreSnapshot: number;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const PolicyReleaseSchema = new Schema<PolicyReleaseDocument>(
  {
    tenantId: { type: String, required: true, index: true },
    policyId: { type: String, required: true, index: true },

    baseVersionId: { type: String, required: true },
    candidateVersionId: { type: String, required: true },

    rolloutPercentage: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ROLLED_BACK"],
      required: true,
    },

    anomalyScore: Number,

    // ✅ Progressive rollout stages
    stages: {
      type: [Number],
      default: [10, 25, 50, 100],
    },

    currentStageIndex: {
      type: Number,
      default: 0,
    },

    lastEvaluatedAt: {
      type: Date,
    },

    autoMode: {
      type: Boolean,
      default: true,
    },

    expansionHistory: [
      {
        percentage: { type: Number },
        expandedAt: { type: Date },
        riskScoreSnapshot: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export const PolicyRelease = mongoose.model<PolicyReleaseDocument>(
  "PolicyRelease",
  PolicyReleaseSchema
);
