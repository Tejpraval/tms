import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";
import type { ApiResponse } from "@/types/api.types";

export interface Release {
  _id: string;
  policyId: string;
  rolloutPercentage: number;
  status: "ACTIVE" | "ROLLED_BACK";
  createdAt?: string;
}

export const listActiveReleases = async (): Promise<Release[]> => {
  const { data } = await apiClient.get<
    ApiResponse<Release[]>
  >(API.RELEASE.ACTIVE);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};
