import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";
import type { ApiResponse } from "@/types/api.types";

export interface AuditLog {
  _id: string;
  action: string;
  actor?: string;
  createdAt: string;
}

export const listRecentAudit = async (): Promise<AuditLog[]> => {
  const { data } = await apiClient.get<
    ApiResponse<AuditLog[]>
  >(API.AUDIT.RECENT);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};
