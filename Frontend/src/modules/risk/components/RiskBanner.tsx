//D:\resumeproject\Frontend\src\modules\risk\components\RiskBanner.tsx
import { useGovernanceRisk } from "../hooks/useGovernanceRisk";
import type { Approval } from "@/modules/policy-approval/types";


import type { PolicyRelease } from "@/modules/rollout/types";



interface Props {
  approvals: Approval[];
  releases: PolicyRelease[];
   slaMultiplier?: number;
}

export const RiskBanner = ({
  approvals,
  releases,
  slaMultiplier = 1,
 }: Props) => {
  const { score } =
    useGovernanceRisk({
      approvals,
      releases,
    }); 
const adjustedScore = Math.round(score * slaMultiplier);

let adjustedLevel: "LOW" | "MEDIUM" | "HIGH";

if (adjustedScore > 60) adjustedLevel = "HIGH";
else if (adjustedScore > 25) adjustedLevel = "MEDIUM";
else adjustedLevel = "LOW";



  const color =
    adjustedLevel === "LOW"
      ? "bg-green-600"
      : adjustedLevel === "MEDIUM"
      ? "bg-yellow-500"
      : adjustedLevel === "HIGH"
      ? "bg-orange-500"
      : "bg-red-600";

  return (
    <div
      className={`${color} rounded-2xl p-6 flex justify-between items-center`}
    >
      <div>
        <p className="text-sm opacity-80">
          Live Governance Risk
        </p>
        <h2 className="text-3xl font-bold">
          {adjustedLevel}
        </h2>
      </div>

      <div className="text-right">
        <p className="text-sm opacity-80">
          Risk Score
        </p>
        <h2 className="text-4xl font-bold">
          {adjustedScore}
        </h2>
      </div>
    </div>
  );
};
