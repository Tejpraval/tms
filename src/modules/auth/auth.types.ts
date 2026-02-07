// export type Role = 'ADMIN' | 'USER';

// src/modules/auth/auth.types.ts
// src/modules/auth/auth.types.ts
import { Role } from "../../constants/roles";

export interface JwtPayload {
  userId: string;
  role: Role;
  tenantId?: string; // 🔑 ADD THIS
}

