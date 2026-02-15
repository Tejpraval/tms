//D:\resumeproject\server\src\modules\policy-approval\approval.types.ts :
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


export interface PolicyActivationMetadata {
  policyId: string;
  version: number;

  // keep backward compatibility if needed
  rbacChange?: any;
  abacChange?: any;
}

export interface PolicyApprovalMetadata extends PolicyActivationMetadata {}
