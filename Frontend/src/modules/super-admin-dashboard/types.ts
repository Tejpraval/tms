export interface TenantOverviewRecord {
    tenantId: string;
    tenantName: string;
    totalPolicies: number;
    highRiskApprovals: number;
    pendingApprovals: number;
}
