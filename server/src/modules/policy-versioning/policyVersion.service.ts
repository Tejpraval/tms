import { Policy } from "./policy.model";
import { PolicyVersion } from "./policyVersion.model";
import { generateChecksum } from "../../utils/checksum";
import mongoose from "mongoose";

/**
 * Create Draft Version
 */
export const createDraftVersion = async (
  policyId: string,
  rules: any,
  userId: string
) => {
  const policy = await Policy.findById(policyId);
  if (!policy) throw new Error("Policy not found");

  // ✅ use latestVersion (number)
  const highestVersion = await PolicyVersion.findOne({ policy: policyId })
    .sort({ version: -1 })
    .lean();

  const newVersionNumber = highestVersion
    ? highestVersion.version + 1
    : 1;


  const version = await PolicyVersion.create({
    policy: policyId,
    version: newVersionNumber,
    rules,
    createdBy: userId,
    checksum: generateChecksum(rules),
    status: "draft"
  });

  // ✅ update latestVersion
  policy.latestVersion = newVersionNumber;
  await policy.save();

  return version;
};

/**
 * Activate Specific Version
 */
export const activateVersion = async (
  policyId: string,
  versionNumber: number,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const policy = await Policy.findById(policyId).session(session);
    if (!policy) throw new Error("Policy not found");

    const version = await PolicyVersion.findOne({
      policy: policyId,
      version: versionNumber
    }).session(session);

    if (!version) throw new Error("Version not found");

    version.status = "active";
    version.activatedAt = new Date();
    version.approvedBy = userId;

    await version.save({ session });

    await PolicyVersion.updateMany(
      { policy: policyId, version: { $ne: versionNumber } },
      { status: "deprecated" },
      { session }
    );

    // ✅ update NUMBER pointer (not ObjectId)
    policy.activeVersion = versionNumber;

    await policy.save({ session });

    await session.commitTransaction();
    session.endSession();

    return version;

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/**
 * Rollback Policy (creates new draft from old version)
 */
export const rollbackPolicy = async (
  policyId: string,
  targetVersion: number,
  userId: string
) => {
  const oldVersion = await PolicyVersion.findOne({
    policy: policyId,
    version: targetVersion
  });

  if (!oldVersion) throw new Error("Version not found");

  return createDraftVersion(policyId, oldVersion.rules, userId);
};
