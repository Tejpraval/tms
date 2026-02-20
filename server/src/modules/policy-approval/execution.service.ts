import mongoose from "mongoose";
import { PolicyApproval } from "./approval.model";
import { ExecutionResult } from "./execution.types";

import { Policy } from "../policy-versioning/policy.model";
import { PolicyVersion } from "../policy-versioning/policyVersion.model";
import { invalidatePolicyCacheByPolicyId } from "../../utils/policyCache";

/**
 * Activate approved policy version
 */
export async function executeApprovedPolicy(
  simulationId: string
): Promise<ExecutionResult> {

  const approval = await PolicyApproval.findOne({ simulationId }).exec();

  if (!approval) {
    throw new Error("Approval not found");
  }

  if (approval.status !== "APPROVED") {
    throw new Error("Policy not approved");
  }

  if (approval.executedAt) {
    return {
      executed: false,
      executedAt: approval.executedAt,
      message: "Policy already executed",
    };
  }

  // ✅ NEW ObjectId-based linkage
  const policyObjectId = approval.policy;
  const version = approval.version;

  if (!policyObjectId || !version) {
    throw new Error("Invalid approval data");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    // 1️⃣ Fetch policy by ObjectId
    const policy = await Policy.findById(policyObjectId).session(session);

    if (!policy) {
      throw new Error("Policy not found");
    }

    // 2️⃣ Fetch specific version using ObjectId reference
    const policyVersion = await PolicyVersion.findOne({
      policy: policyObjectId,
      version
    }).session(session);

    if (!policyVersion) {
      throw new Error("Policy version not found");
    }

    /**
     * 3️⃣ Deprecate other versions
     */
    await PolicyVersion.updateMany(
      { policy: policyObjectId, version: { $ne: version } },
      { status: "deprecated" },
      { session }
    );

    /**
     * 4️⃣ Activate selected version
     */
    policyVersion.status = "active";
    policyVersion.activatedAt = new Date();
    await policyVersion.save({ session });

    /**
     * 5️⃣ Update policy root activeVersion pointer
     */
    policy.activeVersion = version;
    await policy.save({ session });

    /**
     * 6️⃣ Mark approval executed
     */
    approval.executedAt = new Date();
    await approval.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Invalidate cache using ObjectId string
    invalidatePolicyCacheByPolicyId(policyObjectId.toString());

    return {
      executed: true,
      executedAt: approval.executedAt,
      message: "Policy successfully activated",
    };

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}