import { apiClient } from "@/lib/axios";
import type { VersionDiffResult } from "./types";

export const versionComparisonApi = {
    getDiff: async (policyId: string, versionId: number, compareTo: number): Promise<VersionDiffResult> => {
        const res = await apiClient.get<{ success: boolean; data: VersionDiffResult }>(
            `/api/policies/${policyId}/versions/${versionId}/diff?compareTo=${compareTo}`
        );
        return res.data.data;
    },
};
