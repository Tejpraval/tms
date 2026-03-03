// src/pages/dashboard/useDashboardData.ts

import { useQuery } from "@tanstack/react-query";

import { listPolicies } from "@/modules/policy-versioning/api";
import { listActiveReleases } from "@/modules/rollout/api";
import { listRecentAudit } from "@/modules/audit/api";
import { listPendingApprovals } from "@/modules/policy-approval/api";
import { apiClient } from "@/lib/axios";

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

  const {
    data: analyticsData,
    isLoading: analyticsIsLoading,
    error: analyticsError,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["dashboard", "governance-analytics"],
    queryFn: async () => {
      const res = await apiClient.get("/governance-dashboard/analytics");
      return res.data as {
        policyChangeVelocity: number;
        approvalSlaBreaches: number;
        riskTrend: { date: string; score: number }[];
      };
    },
    retry: 1, // Phase 28: Limit retries to prevent network storm
    staleTime: 5 * 60 * 1000, // Treat data as fresh for 5 minutes
  });

  console.log("Dashboard Policies: ", policiesQuery.data);
  console.log("Dashboard Approvals: ", approvalsQuery.data);

  return {
    policies: policiesQuery.data ?? [],
    approvals: approvalsQuery.data ?? [],
    releases: releasesQuery.data ?? [],
    audits: auditQuery.data ?? [],
    analytics: analyticsData,
    isLoading:
      policiesQuery.isLoading ||
      approvalsQuery.isLoading ||
      releasesQuery.isLoading ||
      auditQuery.isLoading ||
      analyticsIsLoading,
    error: analyticsError ? (analyticsError as any).response?.data?.message || "Failed to load dashboard metrics" : null,
    dataUpdatedAt,
  };
};
