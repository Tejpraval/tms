import { PolicyRelease } from "../policy-versioning/policyRelease.model";
import { PolicyApproval } from "../policy-approval/approval.model";
import { PolicyVersion } from "../policy-versioning/policyVersion.model";
import { auditService } from "../audit/audit.service";
import { RolloutEvaluationResult } from "./rolloutMonitor.types";
import mongoose from "mongoose";

const DEFAULT_FAILURE_THRESHOLD = 0.05; // 5%

export async function evaluateRolloutHealth(releaseId: string): Promise<RolloutEvaluationResult | null> {
    const release = await PolicyRelease.findById(releaseId);
    if (!release || release.status !== "ACTIVE") {
        return null; // Only evaluate ACTIVE rollouts
    }

    const policyIdStr = release.policyId;
    const versionStr = release.candidateVersionId;

    const versionDoc = await PolicyVersion.findById(versionStr);
    if (!versionDoc) return null;

    const policyIdObj = new mongoose.Types.ObjectId(policyIdStr);
    const versionNum = versionDoc.version;

    // 1. totalExecutions
    const totalExecutions = await PolicyApproval.countDocuments({
        policy: policyIdObj,
        version: versionNum,
        executedAt: { $exists: true, $ne: null }
    } as any);

    if (totalExecutions === 0) {
        return null; // Safety guard: skip evaluation if absolutely no executions
    }

    // 2. criticalRiskExecutions
    const criticalRiskExecutions = await PolicyApproval.countDocuments({
        policy: policyIdObj,
        version: versionNum,
        executedAt: { $exists: true, $ne: null },
        riskSeverity: "CRITICAL"
    } as any);

    // 3. rollbackCount scoped strictly to candidate version
    const rollbackCount = await PolicyVersion.countDocuments({
        _id: new mongoose.Types.ObjectId(versionStr),
        status: "rolled_back"
    } as any);

    const failureRate = (rollbackCount + criticalRiskExecutions) / totalExecutions;
    const isFailed = failureRate > DEFAULT_FAILURE_THRESHOLD;

    if (isFailed) {
        // Deterministic state transition
        release.status = "FAILED";
        await release.save();

        // Auto-create audit log
        await auditService.createAuditLog({
            tenantId: release.tenantId,
            userId: "SYSTEM_MONITOR",
            action: "Auto-Pause Rollout (Failure Threshold Exceeded)",
            entityType: "POLICY",
            entityId: release.policyId,
            metadata: {
                releaseId: release._id.toString(),
                candidateVersionId: release.candidateVersionId,
                failureRate,
                totalExecutions,
                criticalRiskExecutions,
                rollbackCount,
                threshold: DEFAULT_FAILURE_THRESHOLD
            }
        }).catch(err => console.error("Failed to append audit log on monitor failure:", err));
    }

    return {
        totalExecutions,
        criticalRiskExecutions,
        rollbackCount,
        failureRate,
        isFailed
    };
}

export async function monitorActiveRollouts(): Promise<void> {
    try {
        const activeReleases = await PolicyRelease.find({ status: "ACTIVE" }).select("_id").lean();
        for (const release of activeReleases) {
            try {
                await evaluateRolloutHealth(release._id.toString());
            } catch (err) {
                console.error(`[Rollout Monitor] Error evaluating release ${release._id}:`, err);
            }
        }
    } catch (err) {
        console.error(`[Rollout Monitor] Failed to fetch active releases:`, err);
    }
}
