// src/modules/policy-management/api.ts

import { apiClient } from "@/lib/axios";
import type { PolicyVersion, Policy, PolicyCreationResponse, SimulatePolicyPayload } from "./types";

export const policyApi = {
    // Retrieve all policies
    listPolicies: async () => {
        const res = await apiClient.get<{ success: boolean; data: Policy[] }>("/policies");
        return res.data;
    },

    // Create Root Policy + Draft Version
    createPolicy: async (payload: { name: string; policyId: string; rules: any; tags?: string[] }) => {
        const res = await apiClient.post<PolicyCreationResponse>("/policies", payload);
        return res.data;
    },

    // Get Versions for a Policy
    getPolicyVersions: async (policyId: string) => {
        const res = await apiClient.get<PolicyVersion[]>(`/policies/${policyId}/versions`);
        return res.data;
    },

    // Create a new Draft Version (increment)
    createDraftVersion: async (policyId: string, rules: any) => {
        const res = await apiClient.post<PolicyVersion>(`/policies/${policyId}/draft`, { rules });
        return res.data;
    },

    // Submit Draft to Simulation Engine (triggers pending_approval)
    simulatePolicy: async (payload: SimulatePolicyPayload) => {
        const res = await apiClient.post<{ simulationId: string; risk: any; explanation: any }>("/policies/simulate", payload);
        return res.data;
    },

    // Approve a Simulation
    approvePolicy: async (simulationId: string, comment?: string) => {
        const res = await apiClient.post("/policy-approval/approve", { simulationId, comment });
        return res.data;
    },

    // Reject a Simulation
    rejectPolicy: async (simulationId: string, comment?: string) => {
        const res = await apiClient.post("/policy-approval/reject", { simulationId, comment });
        return res.data;
    },

    // Execute an Approved Policy Segment
    executePolicy: async (simulationId: string) => {
        const res = await apiClient.post("/policy-execution/execute", { simulationId });
        return res.data;
    },

    // Rollback an Active Version explicitly to a deprecated/rolled-back state
    rollbackPolicy: async (policyId: string, version: number) => {
        const res = await apiClient.post(`/policies/${policyId}/rollback/${version}`);
        return res.data;
    }
};
