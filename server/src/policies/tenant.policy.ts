// src/policies/tenant.policy.ts
import { Role } from "../constants/roles";
import { AbacUser, TenantResource } from "./abac.types";

/**
 * READ TENANT
 * - ADMIN can read any tenant
 * - Non-admin can read only their own tenant
 */
export const canReadTenant = ({
  user,
  resource,
}: {
  user: AbacUser;
  resource: TenantResource;
}): boolean => {
  if (user.role === Role.ADMIN) return true;
  return user.tenantId === resource.tenantId;
};

/**
 * UPDATE TENANT
 * - ADMIN can update any tenant
 * - Tenant can update only their own tenant
 * - Archived tenants are immutable
 */
export const canUpdateTenant = ({
  user,
  resource,
}: {
  user: AbacUser;
  resource: TenantResource;
}): boolean => {
  if (resource.status === "ARCHIVED") return false;
  if (user.role === Role.ADMIN) return true;
  return user.tenantId === resource.tenantId;
};

/**
 * DELETE TENANT
 * - Only ADMIN
 */
export const canDeleteTenant = ({
  user,
}: {
  user: AbacUser;
}): boolean => {
  return user.role === Role.ADMIN;
};
