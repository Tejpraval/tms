// src/pages/dashboard/useDashboardData.ts

import { useQuery } from "@tanstack/react-query";

import { listPolicies } from "@/modules/policy-versioning/api";
import { listPendingApprovals } from "@/modules/policy-approval/api";
import { listActiveReleases } from "@/modules/rollout/api";
import { listRecentAudit } from "@/modules/audit/api";

import type { Policy } from "@/types/policy.types";
import type { Approval } from "@/modules/policy-approval/types";
import type { PolicyRelease } from "@/modules/rollout/types";
import type { AuditLog } from "@/modules/audit/types";

export const useDashboardData = () => {
  const policiesQuery = useQuery({
    queryKey: ["dashboard", "policies"],
    queryFn: listPolicies as () => Promise<Policy[]>,
  });

  const approvalsQuery = useQuery({
    queryKey: ["dashboard", "approvals"],
    queryFn: listPendingApprovals as () => Promise<Approval[]>,
    refetchInterval: 15000,
  });

  const releasesQuery = useQuery({
    queryKey: ["dashboard", "releases"],
    queryFn: listActiveReleases as () => Promise<PolicyRelease[]>,
    refetchInterval: 10000,
  });

  const auditQuery = useQuery({
    queryKey: ["dashboard", "audit"],
    queryFn: listRecentAudit as () => Promise<AuditLog[]>,
    refetchInterval: 20000,
  });

  console.log("Dashboard Policies: ", policiesQuery.data);
  console.log("Dashboard Approvals: ", approvalsQuery.data);

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
