// src/modules/policy-simulation/risk/permission.weights.ts

export const PERMISSION_RISK: Record<string, number> = {
  TENANT_DELETE: 30,
  TENANT_CREATE: 20,
  PROPERTY_MANAGE: 15,
  USER_MANAGE: 15,
  PAYMENT_READ: 10,
  TENANT_UPDATE: 10,
  TENANT_READ: 2,
};
