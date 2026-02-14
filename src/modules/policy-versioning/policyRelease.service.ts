import { PolicyRelease } from "./policyRelease.model";
import { PolicyVersion } from "./policyVersion.model";
import { scorePolicyRisk } from "../policy-simulation/risk/risk.scorer";
import {  compareVersions } from "../policy-simulation/engine/diff.engine";
import { Policy } from "./policy.model";

export async function expandRollout(
  releaseId: string,
  newPercentage: number
) {
  const release = await PolicyRelease.findById(releaseId);
  if (!release) throw new Error("Release not found");

  if (newPercentage <= release.rolloutPercentage) {
    throw new Error("Invalid expansion");
  }

  const base = await PolicyVersion.findById(release.baseVersionId);
  const candidate = await PolicyVersion.findById(
    release.candidateVersionId
  );

  if (!base || !candidate) {
    throw new Error("Version not found");
  }

const ruleDiff = await compareVersions(
  base.policyId,
  base.version,
  candidate.version
);

// Convert RuleDiff → risk input format
const riskResult = scorePolicyRisk({
  abacChanges: ruleDiff.modified.map(m => ({
    action: m.after.action ?? "UNKNOWN",
    from: "DENY",
    to: "ALLOW",
  })),
});



  release.rolloutPercentage = newPercentage;

  release.expansionHistory.push({
    percentage: newPercentage,
    expandedAt: new Date(),
    riskScoreSnapshot: riskResult.score,
  });

  await release.save();

  return {
    release,
    risk: riskResult,
  };
}

export async function rollbackRelease(
  releaseId: string
) {
  const release = await PolicyRelease.findById(releaseId);
  if (!release) throw new Error("Release not found");

  release.status = "ROLLED_BACK";
  release.rolloutPercentage = 0;

  await release.save();

  await Policy.findByIdAndUpdate(release.policyId, {
    releaseMode: "STATIC",
    releaseId: null,
  });

  return release;
}
