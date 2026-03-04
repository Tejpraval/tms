import { Document, Model, Schema, Types, model } from "mongoose";

export interface IAuditLog extends Document {
  tenantId: string;
  userId: string; // The user who performed the action
  action: string;
  entityType: "POLICY" | "VERSION" | "APPROVAL" | "ROLE" | "USER";
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date; // Important index here
}

// Ensure the schema does not allow modification by strictly adhering to requirements
const AuditLogSchema = new Schema<IAuditLog>(
  {
    tenantId: { type: String, required: true, index: true }, // Fast retrieval per tenant
    userId: { type: String, required: true },
    action: { type: String, required: true },
    entityType: {
      type: String,
      required: true,
      enum: ["POLICY", "VERSION", "APPROVAL", "ROLE", "USER"],
    },
    entityId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    // Mongoose handles `createdAt` timestamps smoothly via option, but here's direct entry explicitly tracked.
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt, no updatedAt since mutable is NOT allowed
  }
);

// Indexes
// For fast global timeline retrieval query. Compound indexing mostly is standard but let's stick to requirements directly.
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ tenantId: 1, createdAt: -1 }); // Very common pattern for tenant scoped endpoints

// IMPORTANT: Mongoose Pre-save hook to ensure immutability strictly (cannot `save` an existing doc)
AuditLogSchema.pre("save", async function () {
  if (!this.isNew) {
    throw new Error("Audit log documents are immutable. You cannot modify an existing audit log.");
  }
});

// IMPORTANT: Disallow pre-updates commands
AuditLogSchema.pre("findOneAndUpdate", function () {
  throw new Error("Updates are strictly disabled on AuditLog");
});
AuditLogSchema.pre("updateOne", function () {
  throw new Error("Updates are strictly disabled on AuditLog");
});
AuditLogSchema.pre("updateMany", function () {
  throw new Error("Updates are strictly disabled on AuditLog");
});
AuditLogSchema.pre("findOneAndDelete", function () {
  throw new Error("Deletes are strictly disabled on AuditLog");
});
AuditLogSchema.pre("deleteOne", function () {
  throw new Error("Deletes are strictly disabled on AuditLog");
});
AuditLogSchema.pre("deleteMany", function () {
  throw new Error("Deletes are strictly disabled on AuditLog");
});

export const AuditLog: Model<IAuditLog> = model<IAuditLog>("AuditLog", AuditLogSchema);
