import mongoose, { Schema } from "mongoose";
import { Role } from "../../constants/roles";

const AuditSchema = new Schema(
  {
    actorId: { type: Schema.Types.ObjectId, ref: "User" },
    actorRole: { type: String, enum: Object.values(Role) },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceId: { type: String },
    outcome: { type: String, enum: ["ALLOW", "DENY"], required: true },
    reason: { type: String },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", AuditSchema);
