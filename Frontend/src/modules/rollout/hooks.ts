//D:\resumeproject\Frontend\src\modules\rollout\hooks.ts
import { useQuery } from "@tanstack/react-query";
import { getReleaseByPolicy } from "./api";
import type { PolicyRelease } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { expandRelease } from "./api";
import { updateReleaseStatus } from "./api";
export const usePolicyRelease = (
  policyId?: string
) => {
  return useQuery<PolicyRelease | null>({
    queryKey: ["policy-release", policyId],
    queryFn: () =>
      getReleaseByPolicy(policyId as string),
    enabled: !!policyId,

    // ✅ TanStack v5 correct usage
    refetchInterval: (query) => {
      const data = query.state
        .data as PolicyRelease | null;

      if (data?.status === "ACTIVE") {
        return 5000; // poll every 5s
      }

      return false;
    },
  });
};
export const useExpandRelease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      releaseId,
      newPercentage,
    }: {
      releaseId: string;
      newPercentage: number;
    }) => expandRelease(releaseId, newPercentage),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["policy-release"],
      });
    },
  });
};


export const useUpdateReleaseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      releaseId,
      status,
    }: {
      releaseId: string;
      status: "ACTIVE" | "PAUSED";
    }) =>
      updateReleaseStatus(releaseId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["policy-release"],
      });
    },
  });
};