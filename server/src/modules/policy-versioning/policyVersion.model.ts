//D:\resumeproject\server\src\modules\policy-versioning\policyVersion.model.ts
import { Schema, model } from "mongoose";

const policyVersionSchema = new Schema({
  policyId: { type: String, required: true, index: true },
  version: { type: Number, required: true },

  status: {
    type: String,
    enum: ["draft", "active", "deprecated", "rolled_back"],
    default: "draft"
  },

  rules: { type: Object, required: true },

  parentVersion: { type: Number },

  checksum: { type: String, required: true },

  createdBy: { type: String },
  approvedBy: { type: String },
  approvedAt: { type: Date },

  activatedAt: { type: Date }
}, { timestamps: true });

policyVersionSchema.index({ policyId: 1, version: 1 }, { unique: true });

export const PolicyVersion = model("PolicyVersion", policyVersionSchema);
