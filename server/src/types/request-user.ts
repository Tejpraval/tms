// src/types/request-user.ts
import { Role } from "../constants/roles";

export interface RequestUser {
  id: string;
  role: Role;
  tenantId?: string;
  impersonating?: boolean;
  impersonatedTenantId?: string;
  impersonatedRole?: Role;
}
