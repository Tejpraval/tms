import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { ENV } from "../config/env";
import { JwtPayload } from "../modules/auth/auth.types";
import { RequestUser } from "../types/request-user";

const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      ENV.JWT_ACCESS_SECRET
    ) as JwtPayload;

    const user: RequestUser = {
      id: decoded.userId,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    req.user = user; // ✅ correct
    next();
  } catch {
    res.sendStatus(401);
  }
};

export default authMiddleware;
