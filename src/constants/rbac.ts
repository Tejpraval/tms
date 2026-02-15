// src/constants/rbac.ts
import { Role } from "./roles";
import { Permission } from "./permissions";

export const RBAC_MATRIX: Record<Role, Permission[]> = {
  SUPER_ADMIN: Object.values(Permission),

  ADMIN: [
    Permission.TENANT_READ,
    Permission.TENANT_CREATE,
    Permission.TENANT_UPDATE,
    Permission.PROPERTY_MANAGE,
    Permission.PAYMENT_READ,
    Permission.USER_MANAGE,
    Permission.POLICY_WRITE,
    Permission.POLICY_APPROVE,
    Permission.POLICY_ADMIN,
    Permission.POLICY_READ,
  ],

  MANAGER: [
    Permission.TENANT_READ,
    Permission.PROPERTY_MANAGE,
    Permission.PAYMENT_COLLECT,
  ],

  TENANT: [
    Permission.TENANT_READ,
    Permission.PAYMENT_READ,
  ],
};
