import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

interface JwtPayload {
  userId: string;
  role: 'ADMIN' | 'USER';
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(
      token,
      ENV.JWT_ACCESS_SECRET
    ) as JwtPayload;

    req.user = decoded; // 👈 now typed
    next();
  } catch {
    return res.sendStatus(401);
  }
}
