import { useQuery } from "@tanstack/react-query";
import { executionApi } from "./api";

export const executionKeys = {
    all: ["executions"] as const,
    history: (policyId: string) => [...executionKeys.all, policyId] as const,
};

export function useExecutionHistory(policyId: string | undefined) {
    return useQuery({
        queryKey: executionKeys.history(policyId!),
        queryFn: () => executionApi.getExecutionHistory(policyId!),
        enabled: !!policyId,
    });
}
