// import { useQuery } from "@tanstack/react-query";
// import { listPendingApprovals } from "@/modules/policy-approval/api";
// import { listActiveReleases } from "@/modules/rollout/api";
// import type { Approval } from "@/modules/policy-approval/types";
// import type { Release } from "@/modules/rollout/types";

// interface GovernanceRisk {
//   score: number;
//   level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
// }

// function calculateRiskLevel(score: number): GovernanceRisk["level"] {
//   if (score < 20) return "LOW";
//   if (score < 50) return "MEDIUM";
//   if (score < 75) return "HIGH";
//   return "CRITICAL";
// }

// export const useGovernanceRisk = () => {
//   const pendingQuery = useQuery<Approval[]>({
//     queryKey: ["pending-approvals"],
//     queryFn: listPendingApprovals,
//   });

//   const rolloutQuery = useQuery<Release[]>({
//     queryKey: ["active-rollouts"],
//     queryFn: listActiveReleases,
//   });

//   const pendingApprovals = pendingQuery.data ?? [];
//   const activeRollouts = rolloutQuery.data ?? [];

//   // -----------------------------
//   // Compute Avg Pending Risk
//   // -----------------------------
//   const avgPendingRisk =
//     pendingApprovals.length > 0
//       ? pendingApprovals.reduce(
//           (sum, a) => sum + a.riskScore,
//           0
//         ) / pendingApprovals.length
//       : 0;

//   // -----------------------------
//   // Compute Rollout Risk
//   // -----------------------------
//   const rolloutRisk =
//     activeRollouts.length > 0
//       ? activeRollouts.reduce(
//           (sum, r) => sum + (r.anomalyScore ?? 0),
//           0
//         ) / activeRollouts.length
//       : 0;

//   // -----------------------------
//   // Weighted Governance Score
//   // -----------------------------
//   const score =
//     avgPendingRisk * 0.6 +
//     rolloutRisk * 0.4;

//   return {
//     score: Math.round(score),
//     level: calculateRiskLevel(score),
//     isLoading:
//       pendingQuery.isLoading ||
//       rolloutQuery.isLoading,
//   };
// };
