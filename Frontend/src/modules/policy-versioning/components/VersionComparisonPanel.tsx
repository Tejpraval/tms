import { useQuery } from "@tanstack/react-query";
import { compareVersions } from "../api";

interface Props {
  policyId: string;
  v1: number;
  v2: number;
}

export const VersionComparisonPanel = ({
  policyId,
  v1,
  v2,
}: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["compare", policyId, v1, v2],
    queryFn: () => compareVersions(policyId, v1, v2),
    enabled: !!v1 && !!v2,
  });

  if (isLoading) {
    return <div className="text-zinc-400">Comparing...</div>;
  }

  if (!data) return null;

  return (
    <div className="bg-zinc-900 rounded-xl p-5 space-y-4 border border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
        Version Diff
      </h3>

      <pre className="text-xs text-zinc-300 overflow-auto">
        {JSON.stringify(data.diffs, null, 2)}
      </pre>
    </div>
  );
};
