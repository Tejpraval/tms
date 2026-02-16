//D:\resumeproject\Frontend\src\modules\rollout\components\RolloutStatusPanel.tsx
import type { PolicyRelease } from "../types";
import { useExpandRelease, useUpdateReleaseStatus } from "../hooks";

interface Props {
  release: PolicyRelease;
}

const STATUS_COLOR: Record<
  PolicyRelease["status"],
  string
> = {
  DRAFT: "text-yellow-400",
  ACTIVE: "text-blue-400",
  PAUSED: "text-orange-400",
  COMPLETED: "text-green-400",
  ROLLED_BACK: "text-red-400",
};


export const RolloutStatusPanel = ({
  release,
}: Props) => {
    const expandMutation = useExpandRelease(); 
    const statusMutation = useUpdateReleaseStatus();

  return (
    <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-6">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
        Rollout Control
      </h3>

      {/* Status Row */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">
          Status
        </span>
        <span
          className={`text-sm font-semibold ${STATUS_COLOR[release.status]}`}
        >
          {release.status}
        </span>
      </div>

      {/* Exposure */}
      <div>
        <div className="flex justify-between text-sm text-zinc-400 mb-1">
          <span>Exposure</span>
          <span>{release.rolloutPercentage}%</span>
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-500"
            style={{
              width: `${release.rolloutPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* Stage Progression */}
      <div className="space-y-3">
        <p className="text-xs text-zinc-400 uppercase tracking-wide">
          Rollout Stages
        </p>

        <div className="flex items-center justify-between">
          {release.stages.map((stage, index) => {
            const isCompleted =
              index < release.currentStageIndex;

            const isCurrent =
              index === release.currentStageIndex;

            return (
              <div
                key={stage}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                    ${
                      isCompleted
                        ? "bg-green-500 text-black"
                        : isCurrent
                        ? "bg-blue-500 text-black"
                        : "bg-zinc-700 text-zinc-400"
                    }
                  `}
                >
                  {stage}
                </div>

                {index < release.stages.length - 1 && (
                  <div className="w-full h-1 bg-zinc-800 mt-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Manual Promotion */}
{release.status === "ACTIVE" &&
  release.currentStageIndex <
    release.stages.length - 1 && (
    <button
      onClick={() => {
        const nextStage =
          release.stages[
            release.currentStageIndex + 1
          ];

        expandMutation.mutate({
          releaseId: release._id,
          newPercentage: nextStage,
        });
      }}
      className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-sm font-semibold"
    >
      Promote to{" "}
      {
        release.stages[
          release.currentStageIndex + 1
        ]
      }
      %
    </button>
  )}
  {/* Pause / Resume Control */}
{release.status === "ACTIVE" && (
  <button
    onClick={() =>
      statusMutation.mutate({
        releaseId: release._id,
        status: "PAUSED",
      })
    }
    className="w-full bg-orange-600 hover:bg-orange-700 transition px-4 py-2 rounded text-sm font-semibold"
  >
    Pause Rollout
  </button>
)}

{release.status === "PAUSED" && (
  <button
    onClick={() =>
      statusMutation.mutate({
        releaseId: release._id,
        status: "ACTIVE",
      })
    }
    className="w-full bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-sm font-semibold"
  >
    Resume Rollout
  </button>
)}


      {/* Expansion History */}
{release.expansionHistory.length > 0 && (
  <div className="space-y-3">
    <p className="text-xs text-zinc-400 uppercase tracking-wide">
      Expansion History
    </p>

    <div className="space-y-2">
      {[...release.expansionHistory]
        .sort(
          (a, b) =>
            new Date(a.expandedAt).getTime() -
            new Date(b.expandedAt).getTime()
        )
        .map((entry, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-zinc-800 rounded-lg px-3 py-2 text-xs"
          >
            <div className="flex flex-col">
              <span className="text-white font-semibold">
                {entry.percentage}% Exposure
              </span>
              <span className="text-zinc-400">
                {new Date(
                  entry.expandedAt
                ).toLocaleString()}
              </span>
            </div>

            <div className="text-right">
              <span className="text-zinc-400">
                Risk
              </span>
              <div className="text-white font-semibold">
                {entry.riskScoreSnapshot}
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
)}


      {/* Mode */}
      <div className="text-sm text-zinc-400">
        Mode:{" "}
        <span className="text-white">
          {release.autoMode
            ? "Automatic"
            : "Manual"}
        </span>
      </div>

      {/* Risk */}
      {release.anomalyScore !== undefined && (
        <div className="text-sm text-zinc-400">
          Anomaly Score:{" "}
          <span className="text-white">
            {release.anomalyScore}
          </span>
        </div>
      )}
    </div>
  );
};
