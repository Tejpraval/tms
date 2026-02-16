//D:\resumeproject\server\src\modules\policy-versioning\releaseRouter.service.ts
import { Policy } from "./policy.model";
import { PolicyRelease } from "./policyRelease.model";
import { PolicyVersion } from "./policyVersion.model";
import { computeBucket } from "../../utils/bucketing";

export async function resolvePolicyVersion(
  tenantId: string,
  policyObjectId: string,   // this is Mongo _id
  userId: string
): Promise<string> {

  const policy = await Policy.findById(policyObjectId);

  if (!policy) {
    throw new Error("Policy not found");
  }

  /**
   * ===============================
   * STATIC MODE
   * ===============================
   */
  if (policy.releaseMode === "STATIC") {

    const versionDoc = await PolicyVersion.findOne({
      policyId: policy.policyId,
      version: policy.activeVersion
    });

    if (!versionDoc) {
      throw new Error("Active policy version not found");
    }

    return versionDoc._id.toString();
  }

  /**
   * ===============================
   * ROLLOUT MODE
   * ===============================
   */

  const release = await PolicyRelease.findById(policy.releaseId);

  // If rollout invalid → fallback to static
  if (!release || release.status !== "ACTIVE") {

    const versionDoc = await PolicyVersion.findOne({
      policyId: policy.policyId,
      version: policy.activeVersion
    });

    if (!versionDoc) {
      throw new Error("Active policy version not found");
    }

    return versionDoc._id.toString();
  }

  const bucket = computeBucket(userId, policyObjectId);

  if (bucket < release.rolloutPercentage) {
    return release.candidateVersionId.toString();
  }

  return release.baseVersionId.toString();
}
