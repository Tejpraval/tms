export interface RolloutEvaluationResult {
    totalExecutions: number;
    criticalRiskExecutions: number;
    rollbackCount: number;
    failureRate: number;
    isFailed: boolean;
}
