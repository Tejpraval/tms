import { PolicyRelease } from "./policyRelease.model";
import { PolicyVersion } from "./policyVersion.model";
import { Policy } from "./policy.model";

import { computeDiff } from "../policy-simulation/engine/diff.engine";
import { scorePolicyRisk } from "../policy-simulation/risk/risk.scorer";
import { rollbackRelease } from "./policyRelease.service";

/**
 * Evaluate risk between base and candidate versions
 */
async function evaluateReleaseRisk(release: any): Promise<number> {
  const base = await PolicyVersion.findById(release.baseVersionId);
  const candidate = await PolicyVersion.findById(
    release.candidateVersionId
  );

if (!base || !candidate) {
  console.error("Invalid release version reference:", release._id);
  return 0; // fail-safe instead of crash
}

  const diff = computeDiff(base.rules || [], candidate.rules || []);
  const changes = [
  ...(diff.added || []),
  ...(diff.modified || [])
];

const risk = scorePolicyRisk({
  rbacDiffs: undefined,
  abacChanges: changes.map(() => ({
    action: "unknown",
    from: "DENY",
    to: "ALLOW"
  }))
});


  return risk.score;
}

/**
 * Autonomous rollout processor
 */
export async function processActiveRollouts(): Promise<void> {
  const releases = await PolicyRelease.find({
    status: "ACTIVE",
    autoMode: true
  });

  for (const release of releases) {
    try {
      const nextStageIndex = release.currentStageIndex + 1;

      // Already at final stage
      if (nextStageIndex >= release.stages.length) {
        continue;
      }

      const riskScore = await evaluateReleaseRisk(release);

      // 🔴 CRITICAL → rollback //
      // if (riskScore >= 80) {
      if (riskScore >= 80) {
        console.log(
          `Rollback triggered for release ${release._id} (risk: ${riskScore})`
        );

        await rollbackRelease(release._id.toString());
        continue;
      }

      // 🟡 HIGH → hold
      if (riskScore >= 50) {
        console.log(
          `Holding rollout ${release._id} (risk: ${riskScore})`
        );
        continue;
      }

      // 🟢 LOW → promote
      const nextPercentage = release.stages[nextStageIndex];

      release.currentStageIndex = nextStageIndex;
      release.rolloutPercentage = nextPercentage;
      release.lastEvaluatedAt = new Date();

      release.expansionHistory.push({
        percentage: nextPercentage,
        expandedAt: new Date(),
        riskScoreSnapshot: riskScore
      });

      await release.save();

      console.log(
        `Promoted release ${release._id} → ${nextPercentage}%`
      );

      // ✅ If 100% → finalize rollout
      if (nextPercentage === 100) {
        release.status = "COMPLETED";
        await release.save();

        const policy = await Policy.findOne({
          policyId: release.policyId
        });

        if (policy) {
          const candidateVersion = await PolicyVersion.findById(
            release.candidateVersionId
          );

          if (candidateVersion) {
            // 🔥 IMPORTANT: update NUMBER version
            policy.activeVersion = candidateVersion.version;
          }

          policy.releaseMode = "STATIC";
          policy.releaseId = undefined;

          await policy.save();
        }

        console.log(`Release ${release._id} completed.`);
      }

    } catch (err) {
      console.error(
        `Error processing release ${release._id}:`,
        err
      );
    }
  }
}
