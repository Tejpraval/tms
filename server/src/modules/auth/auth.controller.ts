import { Request, Response } from 'express';
import * as AuthService from './auth.service';
import { RefreshToken } from './refreshToken.model';
import { signAccessToken, generateOpaqueToken } from './token.util';
import { User } from '../user/user.model';
import { Tenant } from '../tenant/tenant.model';
import { ENV } from '../../config/env';
import { generateCsrfToken } from './token.util';
import bcrypt from "bcrypt";
import { Role } from "../../constants/roles";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, role, tenantId } = req.body;

    // 🔒 Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 🔒 Role must exist
    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({
        message: "Invalid or missing role",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      role,          // ✅ THIS WAS MISSING
      tenantId,      // ✅ optional but supported
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
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

export async function impersonate(req: Request, res: Response) {
  try {
    const { targetTenantId } = req.body;
    const userContext = req.user;

    if (!userContext || userContext.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: "Forbidden" });
    }

    // 🚨 Anti-Loop Guard
    if ((userContext as any).impersonating) {
      return res.status(400).json({ message: "Nested impersonation loops are forbidden." });
    }

    const tenant = await Tenant.findById(targetTenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // 🔒 Generate Impersonation JWT (Preserving Actor)
    const impersonationToken = signAccessToken({
      userId: userContext.id,
      role: 'SUPER_ADMIN' as Role, // the true actor role
      impersonating: true,
      impersonatedTenantId: targetTenantId,
      impersonatedRole: 'TENANT_ADMIN' as Role
    });

    res.json({ accessToken: impersonationToken, message: `Now impersonating ${tenant.name}` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function exitImpersonation(req: Request, res: Response) {
  try {
    const userContext = req.user;
    if (!userContext) return res.status(401).json({ message: "Unauthorized" });

    // Simply generate a fresh normal Super Admin token
    const normalToken = signAccessToken({
      userId: userContext.id,
      role: 'SUPER_ADMIN' as Role
    });

    res.json({ accessToken: normalToken, message: "Exited impersonation." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const userContext = req.user;
    if (!userContext || !userContext.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { RBAC_MATRIX } = await import("../../constants/rbac");
    const { Role: CustomRoleModel } = await import("../role/role.model");

    let permissions: string[] = [];
    let tenantName: string | null = null;
    let customRoleName: string | null = null;

    const _uc = userContext as any;
    const activeTenantId = _uc.impersonating ? _uc.impersonatedTenantId : _uc.tenantId;

    if (userContext.role === 'SUPER_ADMIN' && !_uc.impersonating) {
      permissions = RBAC_MATRIX['SUPER_ADMIN'] || [];
    } else {
      if (activeTenantId) {
        const tenant = await Tenant.findById(activeTenantId).select('name').lean();
        if (tenant) tenantName = tenant.name || null;
      }

      if (_uc.impersonating) {
        // Bypass custom role DB checks since the Super Admin has no native user document here
        permissions = RBAC_MATRIX[_uc.impersonatedRole as Role] || [];
        customRoleName = null;
      } else {
        const dbUser = await User.findById(userContext.id).select('customRoleId').lean();

        if (dbUser && dbUser.customRoleId) {
          const cRole = await CustomRoleModel.findOne({ _id: dbUser.customRoleId, tenantId: activeTenantId }).lean();
          if (cRole) {
            permissions = cRole.permissions || [];
            customRoleName = cRole.name;
          } else {
            return res.status(403).json({ message: "Forbidden: Custom role not found" });
          }
        } else {
          permissions = RBAC_MATRIX[userContext.role as Role] || [];
        }
      }
    }

    res.json({ success: true, permissions, tenantName: tenantName || null, customRoleName: customRoleName || null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
