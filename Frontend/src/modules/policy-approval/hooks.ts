//D:\resumeproject\Frontend\src\modules\policy-approval\hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listPendingApprovals,
  approveApproval,
  rejectApproval,
} from "./api";
import type { Approval } from "./types";

export const usePendingApprovals = () => {
  return useQuery<Approval[]>({
    queryKey: ["pending-approvals"],
    queryFn: listPendingApprovals,
  });
};

export const useApproveApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (approvalId: string) =>
      approveApproval(approvalId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-approvals"],
      });
    },
  });
};

export const useRejectApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (approvalId: string) =>
      rejectApproval(approvalId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pending-approvals"],
      });
    },
  });
};
