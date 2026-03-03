import { apiClient } from "@/lib/axios";
import type { ExecutionRecord } from "./types";

export const executionApi = {
    getExecutionHistory: async (policyId: string): Promise<ExecutionRecord[]> => {
        const res = await apiClient.get(`/policy-execution/${policyId}/execution-history`);
        return res.data;
    }
};
