import type { PolicyRelease } from "../types";

interface Props {
  release: PolicyRelease;
}

const statusColor: Record<string, string> = {
  ACTIVE: "text-blue-400",
  ROLLED_BACK: "text-red-400",
  PAUSED: "text-yellow-400",
  COMPLETED: "text-emerald-400",
  DRAFT: "text-zinc-400",
};

export const RolloutCard = ({ release }: Props) => {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 space-y-4 border border-zinc-800">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-zinc-400">Policy</p>
          <h3 className="text-lg font-semibold">
            {release.policyId}
          </h3>
        </div>

        <span
          className={`text-sm font-semibold ${
            statusColor[release.status] ?? "text-zinc-400"
          }`}
        >
          {release.status}
        </span>
      </div>

      <div>
        <div className="flex justify-between text-sm text-zinc-400 mb-1">
          <span>Rollout Progress</span>
          <span>{release.rolloutPercentage}%</span>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${release.rolloutPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
