export interface Policy {
  _id: string;
  policyId: string;
  name: string;
  activeVersion: number;
  latestVersion: number;
  releaseMode: "STATIC" | "ROLLOUT";
  releaseId?: string | null;
  tenantId: string;
}
