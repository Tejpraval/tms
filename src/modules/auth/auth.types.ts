export type Role = 'ADMIN' | 'USER';

export interface JwtPayload {
  userId: string;
  role: Role;
}
