// src/modules/policy-management/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { policyApi } from "./api";
import type { PolicyVersion, SimulatePolicyPayload } from "./types";
import { toast } from "react-toastify";

// Key centralizers
export const policyKeys = {
    all: ["policies"] as const,
    lists: () => [...policyKeys.all, "list"] as const,
    versions: (policyId: string) => [...policyKeys.all, "versions", policyId] as const,
};

// ==========================================
// 1. Fetching Hooks
// ==========================================

export function usePolicies() {
    return useQuery({
        queryKey: policyKeys.lists(),
        queryFn: () => policyApi.listPolicies(),
    });
}

export function usePolicyVersions(policyId: string) {
    return useQuery({
        queryKey: policyKeys.versions(policyId),
        queryFn: () => policyApi.getPolicyVersions(policyId),
        enabled: !!policyId,
    });
}

// ==========================================
// 2. Mutation Hooks
// ==========================================

export function useCreatePolicy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { name: string; policyId: string; rules: any; tags?: string[] }) =>
            policyApi.createPolicy(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.lists() });
            toast.success("Policy created successfully.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create policy.");
        }
    });
}

export function useCreateDraft() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ policyId, rules }: { policyId: string; rules: any }) =>
            policyApi.createDraftVersion(policyId, rules),
        onSuccess: (_, { policyId }) => {
            queryClient.invalidateQueries({ queryKey: policyKeys.versions(policyId) });
            toast.success("Draft created successfully.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create draft.");
        }
    });
}

export function useSimulatePolicy(policyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: SimulatePolicyPayload) => policyApi.simulatePolicy(payload),
        // Optimistic UI updates
        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: policyKeys.versions(policyId) });
            const previousVersions = queryClient.getQueryData<PolicyVersion[]>(policyKeys.versions(policyId));

            if (previousVersions) {
                // Optimistically set the mutated version to pending_approval locally
                queryClient.setQueryData<PolicyVersion[]>(policyKeys.versions(policyId), (old) => {
                    return old?.map(v => v.version === payload.version ? { ...v, status: "pending_approval" } : v);
                });
            }
            return { previousVersions };
        },
        onSuccess: () => {
            toast.success("Simulation complete. Pending approval.");
        },
        onError: (err: any, _, context) => {
            if (context?.previousVersions) {
                queryClient.setQueryData(policyKeys.versions(policyId), context.previousVersions);
            }
            toast.error(err.response?.data?.message || "Simulation failed.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.versions(policyId) });
        }
    });
}

export function useApprovePolicy(policyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ simulationId, comment }: { simulationId: string; comment?: string }) =>
            policyApi.approvePolicy(simulationId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.versions(policyId) });
            toast.success("Policy approved.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Approval failed.");
        }
    });
}

export function useRejectPolicy(policyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ simulationId, comment }: { simulationId: string; comment?: string }) =>
            policyApi.rejectPolicy(simulationId, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.versions(policyId) });
            toast.success("Policy rejected.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Rejection failed.");
        }
    });
}


export function useExecutePolicy(policyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (simulationId: string) => policyApi.executePolicy(simulationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.versions(policyId) });
            toast.success("Policy activated successfully.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Execution failed.");
        }
    });
}

export function useRollbackPolicy(policyId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (version: number) => policyApi.rollbackPolicy(policyId, version),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: policyKeys.versions(policyId) });
            toast.success("Policy rolled back explicitly.");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Rollback failed.");
        }
    })
}
