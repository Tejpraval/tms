import { useQuery } from "@tanstack/react-query";
import { versionComparisonApi } from "./api";

export const diffKeys = {
    all: ["versionDiff"] as const,
    detail: (policyId: string, v1: number, v2: number) => [...diffKeys.all, policyId, v1, v2] as const,
};

export function useVersionDiff(policyId: string, v1: number, v2: number) {
    return useQuery({
        queryKey: diffKeys.detail(policyId, v1, v2),
        queryFn: () => versionComparisonApi.getDiff(policyId, v1, v2),
        enabled: !!policyId && !!v1 && !!v2,
    });
}
