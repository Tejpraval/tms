//D:\resumeproject\Frontend\src\modules\rollout\api.ts
import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";
import type { ApiResponse } from "@/types/api.types";
import type { PolicyRelease } from "./types";
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

export const getReleaseByPolicy = async (
  policyId: string
): Promise<PolicyRelease | null> => {
  const { data } = await apiClient.get<
    ApiResponse<PolicyRelease | null>
  >(API.RELEASE.POLICY(policyId)
);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

export const expandRelease = async (
  releaseId: string,
  newPercentage: number
) => {
  const { data } = await apiClient.post(
    API.RELEASE.EXPAND(releaseId),
    { newPercentage }
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

export const updateReleaseStatus = async (
  releaseId: string,
  status: "ACTIVE" | "PAUSED"
) => {
  const { data } = await apiClient.post(
    API.RELEASE.STATUS(releaseId),
    { status }
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};
