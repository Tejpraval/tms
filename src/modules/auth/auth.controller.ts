import { Request, Response } from 'express';
import * as AuthService from './auth.service';
import { RefreshToken } from './refreshToken.model';
import { signAccessToken } from './token.util';
import { User } from '../user/user.model';

export async function register(req: Request, res: Response) {
  const user = await AuthService.register(req.body.email, req.body.password);
  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role
  });
}

export async function login(req: Request, res: Response) {
  const { accessToken, refreshToken } = await AuthService.login(
    req.body.email,
    req.body.password
  );

  res.json({ accessToken, refreshToken });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
    return res.sendStatus(401);
  }

  const user = await User.findById(stored.userId);
  if (!user) return res.sendStatus(401);

  const newAccessToken = signAccessToken({
    userId: user.id,
    role: user.role
  });

  res.json({ accessToken: newAccessToken });
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(400);

  await RefreshToken.updateOne(
    { token: refreshToken },
    { $set: { isRevoked: true } }
  );

  res.json({ success: true });
}
