//D:\resumeproject\Frontend\src\modules\risk\hooks\useGovernanceRisk.ts
import { useMemo } from "react";
import type { Approval } from "@/modules/policy-approval/types";

import type { PolicyRelease } from "@/modules/rollout/types";



interface Input {
  approvals: Approval[];
  releases: PolicyRelease[];
}

export const useGovernanceRisk = ({
  approvals,
  releases,
}: Input) => {
  return useMemo(() => {
    const avgPendingRisk =
      approvals.length > 0
        ? approvals.reduce(
            (acc, a) => acc + (a.riskScore ?? 0),
            0
          ) / approvals.length
        : 0;

    const avgAnomaly =
      releases.length > 0
        ? releases.reduce(
            (acc, r) => acc + (r.anomalyScore ?? 0),
            0
          ) / releases.length
        : 0;

    const riskScore =
      avgPendingRisk * 0.6 +
      avgAnomaly * 0.4;

    let level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

    if (riskScore < 20) level = "LOW";
    else if (riskScore < 40) level = "MEDIUM";
    else if (riskScore < 70) level = "HIGH";
    else level = "CRITICAL";

    return {
      score: Math.round(riskScore),
      level,
    };
  }, [approvals, releases]);
};
