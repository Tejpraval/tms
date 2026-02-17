//D:\resumeproject\Frontend\src\modules\policy-approval\types.ts
export interface Approval {
  _id: string;
  policyId: string;
  version: number;
  requestedBy: string;
  riskScore: number;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED"; 
  metadata?: {
    policyId: string;
    version: number;
  };
  simulationId?: string;
}
