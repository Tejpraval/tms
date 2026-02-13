import { Policy } from "./policy.model";
import { PolicyVersion } from "./policyVersion.model";
import { generateChecksum } from "../../utils/checksum";
import mongoose from "mongoose";
export const createDraftVersion = async (
  policyId: string,
  rules: any,
  userId: string
) => {

  const policy = await Policy.findOne({ policyId });
  if (!policy) throw new Error("Policy not found");

  const newVersionNumber = policy.latestVersion + 1;

  const version = await PolicyVersion.create({
    policyId,
    version: newVersionNumber,
    rules,
    createdBy: userId,
    checksum: generateChecksum(rules),
    status: "draft"
  });

  policy.latestVersion = newVersionNumber;
  await policy.save();

  return version;
};

export const activateVersion = async (
  policyId: string,
  versionNumber: number,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const policy = await Policy.findOne({ policyId }).session(session);
    if (!policy) throw new Error("Policy not found");

    const version = await PolicyVersion.findOne({
      policyId,
      version: versionNumber
    }).session(session);

    if (!version) throw new Error("Version not found");

    version.status = "active";
    version.activatedAt = new Date();
    version.approvedBy = userId;

    await version.save({ session });

    await PolicyVersion.updateMany(
      { policyId, version: { $ne: versionNumber } },
      { status: "deprecated" },
      { session }
    );

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


export const rollbackPolicy = async (
  policyId: string,
  targetVersion: number,
  userId: string
) => {

  const oldVersion = await PolicyVersion.findOne({
    policyId,
    version: targetVersion
  });

  if (!oldVersion) throw new Error("Version not found");

  return createDraftVersion(policyId, oldVersion.rules, userId);
};
