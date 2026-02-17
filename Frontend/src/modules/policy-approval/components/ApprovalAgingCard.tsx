import type { Approval } from "../types";
import { getMinutesAgo, getAgingSeverity } from "@/utils/time";

interface Props {
  approval: Approval;
}

const severityColor: Record<string, string> = {
  LOW: "border-emerald-500",
  MEDIUM: "border-yellow-500",
  HIGH: "border-orange-500",
  CRITICAL: "border-red-600",
};

export const ApprovalAgingCard = ({ approval }: Props) => {
  const minutes = getMinutesAgo(approval.createdAt);
  const severity = getAgingSeverity(minutes);

  return (
    <div
      className={`bg-zinc-900 rounded-2xl p-4 border-l-4 ${
        severityColor[severity] ?? "border-zinc-600"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-zinc-400">Simulation</p>
          <h3 className="text-sm font-semibold">
            {approval.simulationId}
          </h3>
        </div>

        <div className="text-right">
          <p className="text-xs text-zinc-500">Waiting</p>
          <p className="font-semibold">{minutes} min</p>
        </div>
      </div>
    </div>
  );
};
