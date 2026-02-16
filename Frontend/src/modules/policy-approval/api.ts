import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";
import type { ApiResponse } from "@/types/api.types";

export interface Approval {
  _id: string;
  simulationId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export const listPendingApprovals = async (): Promise<Approval[]> => {
  const { data } = await apiClient.get<
    ApiResponse<Approval[]>
  >(API.APPROVAL.PENDING);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};
