import mongoose, { Schema, Document } from "mongoose";
import { ApprovalStatus, ApprovalActorRole } from "./approval.types";

export interface PolicyApprovalDocument extends Document {
  tenantId: string;
  simulationId: string;

  riskScore: number;
  riskSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  status: ApprovalStatus;
  decidedBy?: ApprovalActorRole;
  decidedAt?: Date;

  createdAt: Date;
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
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PolicyApproval = mongoose.model(
  "PolicyApproval",
  PolicyApprovalSchema
);
