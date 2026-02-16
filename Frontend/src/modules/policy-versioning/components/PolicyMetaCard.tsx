//D:\resumeproject\Frontend\src\modules\policy-versioning\components\PolicyMetaCard.tsx
import type { Policy } from "../types";

interface Props {
  policy: Policy;
}

export const PolicyMetaCard = ({ policy }: Props) => {
    const isRollingOut = policy.releaseMode === "ROLLOUT";

  return (
    <div className="bg-zinc-900 rounded-xl p-5 grid grid-cols-3 gap-4">
      <div>
        <p className="text-sm text-zinc-400">
          Active Version
        </p>
        <p className="text-xl font-bold">
          v{policy.activeVersion}
        </p>
      </div>

      <div>
        <p className="text-sm text-zinc-400">
          Latest Version
        </p>
        <p className="text-xl font-bold">
          v{policy.latestVersion}
        </p>
      </div>

      <div>
  <p className="text-sm text-zinc-400">Release Mode</p>

  <p
    className={`text-xl font-bold ${
      isRollingOut ? "text-blue-400" : ""
    }`}
  >
    {policy.releaseMode}
  </p>

  {isRollingOut && (
    <p className="text-xs text-blue-300 mt-1">
      Progressive rollout active
    </p>
  )}
</div>

    </div>
  );
};
