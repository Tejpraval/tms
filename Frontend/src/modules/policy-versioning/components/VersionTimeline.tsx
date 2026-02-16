import type { PolicyRelease } from "@/modules/rollout/types";
import type { PolicyVersion } from "../types";
import type { PolicyVersionStatus } from "../types";

interface Props {
  versions: PolicyVersion[];
  activeVersion: number;
  release?: PolicyRelease | null;
}

const STATUS_STYLE: Record<PolicyVersionStatus, string> = {
  draft: "bg-yellow-500/20 text-yellow-400",
  active: "bg-green-500/20 text-green-400",
  deprecated: "bg-zinc-600/30 text-zinc-400",
  rolled_back: "bg-red-500/20 text-red-400",
};

export const VersionTimeline = ({
  versions,
  activeVersion,
  release,
}: Props) => {
  return (
    <div className="bg-zinc-900 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">
        Version Timeline
      </h2>

      <div className="space-y-3">
        {versions.map((version) => {
          const isActive =
            version.version === activeVersion;

          // 🔵 Detect Candidate Version
          const isCandidate =
            release &&
            release.candidateVersionId === version._id &&
            release.status === "ACTIVE";

          return (
            <div
              key={version._id}
              className={`p-4 rounded-lg flex justify-between items-center border transition
                ${
                  isActive
                    ? "bg-green-900/40 border-green-500"
                    : isCandidate
                    ? "bg-blue-900/40 border-blue-500"
                    : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                }
              `}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">
                    v{version.version}
                  </p>

                  {/* 🟢 LIVE */}
                  {isActive && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      LIVE
                    </span>
                  )}

                  {/* 🔵 ROLLING OUT */}
                  {isCandidate && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {release?.rolloutPercentage}% ROLLING
                    </span>
                  )}
                </div>

                <span
                  className={`px-2 py-1 text-xs rounded ${STATUS_STYLE[version.status]}`}
                >
                  {version.status.toUpperCase()}
                </span>
              </div>

              <div className="text-right text-xs text-zinc-400">
                <div>
                  Created{" "}
                  {new Date(
                    version.createdAt
                  ).toLocaleDateString()}
                </div>

                {version.activatedAt && (
                  <div>
                    Activated{" "}
                    {new Date(
                      version.activatedAt
                    ).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
