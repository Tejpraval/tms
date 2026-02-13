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

  const { policyId, version } = approval.metadata || {};

  if (!policyId || !version) {
    throw new Error("Invalid approval metadata");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const policy = await Policy.findOne({ policyId }).session(session);

    if (!policy) {
      throw new Error("Policy not found");
    }

    const policyVersion = await PolicyVersion.findOne({
      policyId,
      version
    }).session(session);

    if (!policyVersion) {
      throw new Error("Policy version not found");
    }

    /**
     * 1️⃣ Mark previous versions deprecated
     */
    await PolicyVersion.updateMany(
      { policyId, version: { $ne: version } },
      { status: "deprecated" },
      { session }
    );

    /**
     * 2️⃣ Activate selected version
     */
    policyVersion.status = "active";
    policyVersion.activatedAt = new Date();

    await policyVersion.save({ session });

    /**
     * 3️⃣ Update active pointer
     */
    policy.activeVersion = version;
    await policy.save({ session });

    /**
     * 4️⃣ Mark approval executed
     */
    approval.executedAt = new Date();
    await approval.save({ session });

    await session.commitTransaction();
    session.endSession();
    invalidatePolicyCacheByPolicyId(policyId);
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

