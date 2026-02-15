import { Schema, model } from 'mongoose';

const TenantSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Tenant = model('Tenant', TenantSchema);
