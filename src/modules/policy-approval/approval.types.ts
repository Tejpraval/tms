export type ApprovalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type ApprovalActorRole =
  | "SYSTEM"
  | "MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface ApprovalDecision {
  status: ApprovalStatus;
  decidedBy: ApprovalActorRole;
  decidedAt: string;
  comment?: string;
}
