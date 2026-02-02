import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' }
});

export const User = model('User', UserSchema);
