import { useActivateVersion, useRollbackVersion } from "../hooks";
import type { PolicyVersion } from "../types";

interface Props {
  policyId: string;
  version: PolicyVersion;
  activeVersion: number;
}

export const VersionActionsPanel = ({
  policyId,
  version,
  activeVersion,
}: Props) => {
  const activate = useActivateVersion();
  const rollback = useRollbackVersion();

  const canActivate = version.status === "draft";
  const canRollback =
    version.version !== activeVersion &&
    version.status !== "rolled_back";

  return (
    <div className="bg-zinc-900 rounded-xl p-5 space-y-4 border border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
        Version Actions
      </h3>

      {canActivate && (
        <button
          onClick={() =>
            activate.mutate({
              id: policyId,
              version: version.version,
            })
          }
          className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
        >
          Activate Version
        </button>
      )}

      {canRollback && (
        <button
          onClick={() =>
            rollback.mutate({
              id: policyId,
              version: version.version,
            })
          }
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Rollback to This Version
        </button>
      )}
    </div>
  );
};
