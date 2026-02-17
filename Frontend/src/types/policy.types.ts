//D:\resumeproject\Frontend\src\types\policy.types.ts
export interface Policy {
  _id: string;
  policyId: string;
  name?: string;

  activeVersion: number;
  latestVersion: number;

  releaseMode: "STATIC" | "ROLLOUT";
  releaseId?: string | null;

  metadata?: {
    policyId: string;
    activeVersion: number;
  };

  createdAt?: string;
  updatedAt?: string;
}
