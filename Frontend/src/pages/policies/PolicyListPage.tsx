//D:\resumeproject\Frontend\src\pages\policies\PolicyListPage.tsx
import { usePolicies } from "@/modules/policy-versioning/hooks";
import { useNavigate } from "react-router-dom";

const PolicyListPage = () => {
  const { data: policies, isLoading } =
    usePolicies();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        Loading policies...
      </div>
    );
  }

  if (!policies || policies.length === 0) {
    return (
      <div className="p-6 text-zinc-400">
        No policies found.
      </div>
    );
  }

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-semibold">
        Policies
      </h1>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-800 text-zinc-400 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3">
                Policy ID
              </th>
              <th className="text-left px-4 py-3">
                Active Version
              </th>
              <th className="text-left px-4 py-3">
                Latest Version
              </th>
              <th className="text-left px-4 py-3">
                Release Mode
              </th>
            </tr>
          </thead>

          <tbody>
            {policies.map((policy) => (
              <tr
                key={policy._id}
                onClick={() =>
                  navigate(
                    `/policies/${policy._id}`
                  )
                }
                className="cursor-pointer border-t border-zinc-800 hover:bg-zinc-800/50 transition"
              >
                <td className="px-4 py-3 font-medium">
                  {policy.metadata?.policyId}
                </td>

                <td className="px-4 py-3">
                  v{policy.metadata?.activeVersion ?? 0}
                </td>

                <td className="px-4 py-3">
                  v{policy.latestVersion}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold
                      ${
                        policy.releaseMode ===
                        "ROLLOUT"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-green-500/20 text-green-400"
                      }
                    `}
                  >
                    {policy.releaseMode}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PolicyListPage;
