export interface ExecutionRecord {
    versionId: string;
    executedAt: string;
    executedBy: string;
    riskSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}
