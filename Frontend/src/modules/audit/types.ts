export interface AuditLog {
  outcome: string;
  _id: string;
  action: string;
  actor?: string;
  createdAt: string;
}
