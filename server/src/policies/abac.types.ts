// src/policies/abac.types.ts
import { Role } from "../constants/roles";

export interface AbacUser {
  id: string;
  role: Role;
  tenantId?: string;
}

export interface TenantResource {
  tenantId: string;
  ownerId?: string;
  status?: "ACTIVE" | "ARCHIVED";
}
