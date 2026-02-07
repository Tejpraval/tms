//D:\resumeproject\server\src\middleware\auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { JwtPayload } from "../modules/auth/auth.types"; // raw token type
import { RequestUser } from "../types/request-user";
// interface JwtPayload {
//   userId: string;
//   role: 'ADMIN' | 'USER';
// }

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(
      token,
      ENV.JWT_ACCESS_SECRET
    ) as JwtPayload;

    // 🔑 Explicit mapping (this is the fix)
    const user: RequestUser = {
      id: decoded.userId,     // map userId → id
      role: decoded.role,
      tenantId: decoded.tenantId, // optional
    };

    req.user = user;
    next();
  } catch {
    return res.sendStatus(401);
  }
}
