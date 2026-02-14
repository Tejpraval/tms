import mongoose, { Schema, Document } from "mongoose";

export interface PolicyDocument extends Document {
  name: string;
  policyId: string;
  tenantId: string;

  activeVersion: number;
  latestVersion: number;

  releaseMode: "STATIC" | "ROLLOUT";
  releaseId?: mongoose.Types.ObjectId;

  tags?: string[];
}

const policySchema = new Schema<PolicyDocument>(
  {
    name: { type: String, required: true },
    policyId: { type: String, required: true, unique: true },
    tenantId: { type: String, required: true, index: true },

    activeVersion: { type: Number, default: 1 },
    latestVersion: { type: Number, default: 1 },

    tags: [String],

    releaseMode: {
      type: String,
      enum: ["STATIC", "ROLLOUT"],
      default: "STATIC",
    },

    releaseId: {
      type: Schema.Types.ObjectId,
      ref: "PolicyRelease",
    },
  },
  { timestamps: true }
);

export const Policy = mongoose.model<PolicyDocument>(
  "Policy",
  policySchema
);
