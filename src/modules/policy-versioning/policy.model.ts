import { Schema, model } from "mongoose";

const policySchema = new Schema({
  name: { type: String, required: true },
  policyId: { type: String, required: true, unique: true },

  activeVersion: { type: Number, default: 1 },
  latestVersion: { type: Number, default: 1 },

  tags: [String]
}, { timestamps: true });

export const Policy = model("Policy", policySchema);
