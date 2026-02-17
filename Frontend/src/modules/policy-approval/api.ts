//D:\resumeproject\Frontend\src\modules\policy-approval\api.ts
import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";
import type { ApiResponse } from "@/types/api.types";
import type { Approval } from "./types";

export const listPendingApprovals = async (): Promise<Approval[]> => {
  const { data } = await apiClient.get<
    ApiResponse<Approval[]>
  >(API.APPROVAL.PENDING);

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

export const approveApproval = async (
  approvalId: string
) => {
  const { data } = await apiClient.post(
    API.APPROVAL.APPROVE,
    { approvalId }
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};

export const rejectApproval = async (
  approvalId: string
) => {
  const { data } = await apiClient.post(
    API.APPROVAL.REJECT,
    { approvalId }
  );

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.data;
};
