import * as jwt from 'jsonwebtoken';
import type { SignOptions, Secret } from 'jsonwebtoken';
import crypto from 'crypto';
import { ENV } from '../../config/env';

const accessTokenOptions: SignOptions = {
  expiresIn: ENV.ACCESS_TOKEN_EXPIRY as SignOptions['expiresIn']
};

const refreshTokenOptions: SignOptions = {
  expiresIn: ENV.REFRESH_TOKEN_EXPIRY as SignOptions['expiresIn']
};

export function signAccessToken(
  payload: { userId: string; role: string }
): string {
  return jwt.sign(
    payload,
    ENV.JWT_ACCESS_SECRET as Secret,
    accessTokenOptions
  );
}

export function signRefreshToken(
  payload: { userId: string }
): string {
  return jwt.sign(
    payload,
    ENV.JWT_REFRESH_SECRET as Secret,
    refreshTokenOptions
  );
}

export function generateOpaqueToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
