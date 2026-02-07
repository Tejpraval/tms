import mongoose, { Schema, Document } from "mongoose";


import { Role } from "../../constants/roles";

export interface IUser extends Document {
  email: string;
  password: string;
  role: Role;              // ✅ enum, not string union
  tenantId?: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(Role), // ✅ enum-backed
    required: true,
  },
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: "Tenant",
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);
