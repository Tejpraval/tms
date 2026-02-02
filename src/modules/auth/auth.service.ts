import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { User } from '../user/user.model';

export async function register(email: string, password: string) {
  const hash = await bcrypt.hash(password, 12);
  return User.create({ email, password: hash });
}

import { RefreshToken } from './refreshToken.model';
import { signAccessToken, generateOpaqueToken } from './token.util';

export async function login(email: string, password: string) {
  console.log('LOGIN ATTEMPT:', email);

  const user = await User.findOne({ email });
  console.log('USER FOUND:', !!user);

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.password) {
    throw new Error('User password missing');
  }

  const isValid = await bcrypt.compare(password, user.password);
  console.log('PASSWORD VALID:', isValid);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role
  });

  const refreshToken = generateOpaqueToken();

  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { accessToken, refreshToken };
}


