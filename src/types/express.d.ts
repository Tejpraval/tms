import { Role } from "../constants/roles";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: Role;
      tenantId?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
