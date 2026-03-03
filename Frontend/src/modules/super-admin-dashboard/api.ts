import { apiClient } from "@/lib/axios";
import type { TenantOverviewRecord } from "./types";

export const getGovernanceOverview = async (): Promise<TenantOverviewRecord[]> => {
    const response = await apiClient.get("/super-admin/governance-overview");
    return response.data.data || response.data; // Compatible with both the new standard format and the old format
};
