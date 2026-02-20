// src/modules/simulation/types.ts

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RbacDiffSummary {
    impactedUsers: number;
    blastRadius: Severity;
}

export interface RbacDiffRecord {
    gained: string[];
    lost: string[];
}

export interface RbacSimulationResult {
    summary: RbacDiffSummary;
    diffs: Record<string, RbacDiffRecord>;
}

export interface AbacDecisionChange {
    userId: string;
    resourceId: string;
    action: string;
    before: boolean;
    after: boolean;
}

export interface AbacSimulationResult {
    decisionChanges: AbacDecisionChange[];
}

export interface SimulationRisk {
    score: number;
    severity: Severity;
    factors: string[];
}

export interface SimulationAuditStep {
    step: string;
    at: string;
}

export interface SimulationExplanation {
    summary: string;
    details: {
        type: "rbac" | "abac" | "risk";
        message: string;
        impact?: string;
    }[];
    auditTrail: SimulationAuditStep[];
}

export interface UnifiedSimulationResult {
    simulationId: string;
    rbac?: RbacSimulationResult;
    abac?: AbacSimulationResult;
    risk?: SimulationRisk;
    explanation?: SimulationExplanation;
}
