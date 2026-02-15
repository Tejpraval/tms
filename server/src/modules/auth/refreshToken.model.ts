import { Schema, model, Types } from 'mongoose';

const refreshTokenSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  replacedByToken: {
    type: String,
    default: null
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export const RefreshToken = model('RefreshToken', refreshTokenSchema);
