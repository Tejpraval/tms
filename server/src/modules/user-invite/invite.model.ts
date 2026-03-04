import mongoose, { Schema, Document } from "mongoose";

export interface IInvite extends Document {
    tenantId: mongoose.Types.ObjectId;
    email: string;
    roleId?: mongoose.Types.ObjectId;
    staticRole?: string;
    hashedToken: string;
    expiresAt: Date;
    status: "PENDING" | "ACCEPTED" | "EXPIRED";
    createdBy: mongoose.Types.ObjectId;
}

const InviteSchema = new Schema<IInvite>(
    {
        tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
        email: { type: String, required: true },
        roleId: { type: Schema.Types.ObjectId, ref: "Role" },
        staticRole: { type: String },
        hashedToken: { type: String, required: true },
        expiresAt: { type: Date, required: true },
        status: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "EXPIRED"],
            default: "PENDING",
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

// Unique compound index based on the hashed token
InviteSchema.index({ hashedToken: 1 }, { unique: true });

// Optional: Purely an optimization. Business logic will explicitly check expiry.
InviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invite = mongoose.model<IInvite>("Invite", InviteSchema);
