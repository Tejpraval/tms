import { Request, Response } from 'express';
import * as AuthService from './auth.service';
import { RefreshToken } from './refreshToken.model';
import { signAccessToken  , generateOpaqueToken} from './token.util';
import { User } from '../user/user.model';
import { ENV } from '../../config/env';
import { generateCsrfToken } from './token.util';

export async function register(req: Request, res: Response) {
  const user = await AuthService.register(req.body.email, req.body.password);
  res.status(201).json({
    _id: user._id,
    email: user.email,
    role: user.role
  });
}

export async function login(req: Request, res: Response) {
  try {
    const { accessToken, refreshToken } =
      await AuthService.login(req.body.email, req.body.password);

    res.cookie(ENV.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: false, // true in prod
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
}



export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies[ENV.COOKIE_NAME];
  if (!refreshToken) return res.sendStatus(401);

  const existing = await RefreshToken.findOne({ token: refreshToken });

  // 🚨 reuse / invalid token detected
  if (!existing || existing.isRevoked || existing.expiresAt < new Date()) {
    if (existing) {
      await RefreshToken.updateMany(
        { userId: existing.userId },
        { isRevoked: true }
      );
    }
    return res.sendStatus(401);
  }

  const user = await User.findById(existing.userId);
  if (!user) return res.sendStatus(401);

  // 🔑 create new tokens
  const newAccessToken = signAccessToken({
    userId: user.id,
    role: user.role
  });

  const newRefreshToken = generateOpaqueToken();

  // 🔁 rotate refresh token
  existing.isRevoked = true;
  existing.replacedByToken = newRefreshToken;
  await existing.save();

  await RefreshToken.create({
    userId: user.id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

const csrfToken = generateCsrfToken();

res.cookie(ENV.COOKIE_NAME, newRefreshToken, {
  httpOnly: true,
  secure: false,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

res.cookie('csrf_token', csrfToken, {
  httpOnly: false,
  secure: false,
  sameSite: 'strict'
});

res.json({ accessToken: newAccessToken });


}


export async function logout(req: Request, res: Response) {
  const refreshToken = req.cookies[ENV.COOKIE_NAME];
  if (!refreshToken) return res.sendStatus(204);

  await RefreshToken.updateOne(
    { token: refreshToken },
    { $set: { isRevoked: true } }
  );

  res.clearCookie(ENV.COOKIE_NAME, {
  httpOnly: true,
  sameSite: 'strict',
  secure: false
});

  res.json({ success: true });
}


