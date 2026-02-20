import { Counter, Histogram, Gauge } from 'prom-client';
import { register } from './metricsRegistry';

// Core Governance Metrics
const policySimulationTotal = new Counter({
    name: 'policy_simulation_total',
    help: 'Total number of policy simulations executed',
    labelNames: ['tenant'],
    registers: [register],
});

const policySimulationDuration = new Histogram({
    name: 'policy_simulation_duration_seconds',
    help: 'Policy simulation execution duration in seconds',
    labelNames: ['tenant'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
    registers: [register],
});

/**
 * Higher-order function to instrument policy simulations
 */
export const instrumentPolicySimulation = async <T>(
    tenantId: string,
    fn: () => Promise<T>
): Promise<T> => {
    // If metrics disabled, bypass overhead
    if (process.env.OBS_ENABLED !== 'true') {
        return fn();
    }

    const endTimer = policySimulationDuration.startTimer({ tenant: tenantId });
    policySimulationTotal.inc({ tenant: tenantId });

    try {
        return await fn();
    } finally {
        endTimer();
    }
};

// Rollout Metrics
const rolloutStageProgress = new Gauge({
    name: 'rollout_stage_progress',
    help: 'Current rollout stage percentage (0-100)',
    labelNames: ['tenant', 'policyId'],
    registers: [register],
});

const rolloutFailureTotal = new Counter({
    name: 'rollout_failure_total',
    help: 'Total number of rollout failures triggering rollback',
    labelNames: ['tenant', 'policyId'],
    registers: [register],
});

export const recordRolloutStage = (tenantId: string, policyId: string, stage: number) => {
    if (process.env.OBS_ENABLED === 'true') {
        rolloutStageProgress.set({ tenant: tenantId, policyId }, stage);
    }
};

export const recordRolloutFailure = (tenantId: string, policyId: string) => {
    if (process.env.OBS_ENABLED === 'true') {
        rolloutFailureTotal.inc({ tenant: tenantId, policyId });
    }
};

// Risk & Approval Metrics
const riskScoreDistribution = new Histogram({
    name: 'risk_score_distribution',
    help: 'Distribution of calculated risk scores (0-100)',
    buckets: [0, 25, 50, 75, 90, 100],
    registers: [register],
});

const approvalDecisionsTotal = new Counter({
    name: 'approval_decisions_total',
    help: 'Total number of approval decisions made',
    labelNames: ['tenant', 'decision'],
    registers: [register],
});

export const recordRiskScore = (score: number) => {
    if (process.env.OBS_ENABLED === 'true') {
        riskScoreDistribution.observe(score);
    }
};

export const recordApprovalDecision = (tenantId: string, decision: 'approved' | 'rejected' | 'escalated') => {
    if (process.env.OBS_ENABLED === 'true') {
        approvalDecisionsTotal.inc({ tenant: tenantId, decision });
    }
};
