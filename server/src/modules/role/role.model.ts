import mongoose, { Schema, Document } from "mongoose";
import { Permission } from "../../constants/permissions";

export interface IRole extends Document {
    name: string;
    tenantId: mongoose.Types.ObjectId;
    permissions: Permission[];
    createdAt: Date;
    updatedAt: Date;
}

const RoleSchema = new Schema<IRole>({
    name: { type: String, required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    permissions: [{ type: String, enum: Object.values(Permission) }],
}, { timestamps: true });

RoleSchema.index({ name: 1, tenantId: 1 }, { unique: true });

export const Role = mongoose.model<IRole>("Role", RoleSchema);
