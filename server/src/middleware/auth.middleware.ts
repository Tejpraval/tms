import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { ENV } from "../config/env";
import { JwtPayload } from "../modules/auth/auth.types";
import { RequestUser } from "../types/request-user";
import { enforceTenantActive } from "./enforceTenantActive";

const authMiddleware: RequestHandler = async (req, res, next) => {
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
      role: decoded.impersonating ? (decoded.impersonatedRole as any) : decoded.role,
      tenantId: decoded.impersonating ? decoded.impersonatedTenantId : decoded.tenantId,
      impersonating: decoded.impersonating,
      impersonatedTenantId: decoded.impersonatedTenantId,
      impersonatedRole: decoded.impersonatedRole
    };

    req.user = user; // ✅ correct

    // Defer to the active tenant enforcer before advancing
    await enforceTenantActive(req, res, next);
  } catch (err) {
    res.sendStatus(401);
  }
};

export default authMiddleware;
