import { Schema, model } from 'mongoose';

const TenantSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    isDeleted: { type: Boolean, default: false },
    status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' }
  },
  { timestamps: true }
);

export const Tenant = model('Tenant', TenantSchema);
