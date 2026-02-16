import { useQuery } from "@tanstack/react-query";
import { listPolicies } from "@/modules/policy-versioning/api";
import { listPendingApprovals } from "@/modules/policy-approval/api";
import { listActiveReleases } from "@/modules/rollout/api";
import { listRecentAudit } from "@/modules/audit/api";

export const useDashboardData = () => {
  const policiesQuery = useQuery({
    queryKey: ["dashboard", "policies"],
    queryFn: listPolicies,
  });

  const approvalsQuery = useQuery({
    queryKey: ["dashboard", "approvals"],
    queryFn: listPendingApprovals,
    refetchInterval: 15000, // 15 sec polling
  });

  const releasesQuery = useQuery({
    queryKey: ["dashboard", "releases"],
    queryFn: listActiveReleases,
    refetchInterval: 10000, // 10 sec polling
  });

  const auditQuery = useQuery({
    queryKey: ["dashboard", "audit"],
    queryFn: listRecentAudit,
    refetchInterval: 20000,
  });

  return {
    policies: policiesQuery.data ?? [],
    approvals: approvalsQuery.data ?? [],
    releases: releasesQuery.data ?? [],
    audits: auditQuery.data ?? [],
    isLoading:
      policiesQuery.isLoading ||
      approvalsQuery.isLoading ||
      releasesQuery.isLoading ||
      auditQuery.isLoading,
  };
};
