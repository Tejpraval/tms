import mongoose, { Schema, Document } from "mongoose";
import { ApprovalStatus, ApprovalActorRole } from "./approval.types";
import { SimulationChange } from "../policy-simulation/simulation.types";
import { PolicyApprovalMetadata } from "./approval.types";
export interface PolicyApprovalDocument extends Document {
  tenantId: string;
  simulationId: string;

  riskScore: number;
  riskSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  status: ApprovalStatus;
  decidedBy?: ApprovalActorRole;
  decidedAt?: Date;

  // ✅ NEW
  executedAt?: Date;

  // ✅ NEW (this is critical for Phase 6.2)
  metadata?: PolicyApprovalMetadata;
  createdAt: Date;

  policy?: mongoose.Types.ObjectId;
  version?: number;
  requestedBy?: string;
}

const PolicyApprovalSchema = new Schema<PolicyApprovalDocument>(
  {
    tenantId: { type: String, required: true },
    simulationId: { type: String, required: true },

    riskScore: { type: Number, required: true },
    riskSeverity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      required: true,
    },

    decidedBy: {
      type: String,
      enum: ["SYSTEM", "MANAGER", "ADMIN", "SUPER_ADMIN"],
    },

    decidedAt: { type: Date },

    // ✅ ADD THIS
    executedAt: { type: Date },

    // ✅ ADD THIS
    metadata: {
      type: Schema.Types.Mixed,
    },

    policy: { type: Schema.Types.ObjectId, ref: 'Policy' },
    version: { type: Number },
    requestedBy: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PolicyApproval = mongoose.model<PolicyApprovalDocument>(
  "PolicyApproval",
  PolicyApprovalSchema
);
