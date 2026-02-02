// src/modules/user/user.types.ts
export type Role = 'ADMIN' | 'USER';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  role: Role;
}
