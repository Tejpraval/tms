export interface AuditLog {
  _id: string;
  action: string;
  actor?: string;
  createdAt: string;
}
