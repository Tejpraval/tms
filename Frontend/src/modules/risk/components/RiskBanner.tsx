import { calculateDashboardRisk } from "@/utils/dashboardRisk";

interface Props {
  pendingApprovals: number;
  activeRollouts: number;
  totalPolicies: number;
}

const severityColor = {
  LOW: "bg-emerald-600",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-600",
};

export const RiskBanner = ({
  pendingApprovals,
  activeRollouts,
  totalPolicies,
}: Props) => {
  const { score, severity } = calculateDashboardRisk({
    pendingApprovals,
    activeRollouts,
    totalPolicies,
  });

  return (
    <div
      className={`rounded-2xl p-6 text-white ${severityColor[severity]} transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">
            Governance Risk Level
          </p>
          <h2 className="text-3xl font-bold">
            {severity}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-sm opacity-80">
            Risk Score
          </p>
          <p className="text-4xl font-bold">
            {score}
          </p>
        </div>
      </div>
    </div>
  );
};
