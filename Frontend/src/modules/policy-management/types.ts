// src/modules/policy-management/types.ts

export type VersionStatus =
    | "draft"
    | "pending_approval"
    | "approved"
    | "active"
    | "deprecated"
    | "rolled_back";

export interface PolicyVersion {
    _id: string;
    policy: string;
    version: number;
    status: VersionStatus;
    rules: any;
    parentVersion?: number;
    checksum: string;
    createdBy?: string;
    approvedBy?: string;
    approvedAt?: string;
    activatedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Policy {
    _id: string;
    name: string;
    policyId: string;
    tenantId: string;
    activeVersion?: number;
    latestVersion: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface PolicyCreationResponse {
    success: boolean;
    data: {
        policy: Policy;
        version: PolicyVersion;
    };
}

export interface SimulationChange {
    action: "add" | "remove" | "modify";
    resource: string;
    attributes: Record<string, string>;
}

export interface SimulatePolicyPayload {
    change: SimulationChange;
    tenantId?: string;
    policyId: string;
    version: number;
    rbacChange?: any;
    abacChange?: any;
}
