//D:\resumeproject\Frontend\src\pages\approvals\ApprovalConsolePage.tsx
import {
  usePendingApprovals,
  useApproveApproval,
  useRejectApproval,
} from "@/modules/policy-approval/hooks";
import { useState } from "react";
import { DiffViewer } from "@/modules/version-comparison/components/DiffViewer";
import { useVersionDiff } from "@/modules/version-comparison/hooks";

const ApprovalConsolePage = () => {
  const { data, isLoading } = usePendingApprovals();
  const approveMutation = useApproveApproval();
  const rejectMutation = useRejectApproval();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        Loading approvals...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-zinc-400">
        No pending approvals.
      </div>
    );
  }
  console.log(data);

  return (

    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-semibold">
        Approval Console
      </h1>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-800 text-zinc-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">
                Policy
              </th>
              <th className="px-4 py-3 text-left">
                Version
              </th>
              <th className="px-4 py-3 text-left">
                Risk
              </th>
              <th className="px-4 py-3 text-left">
                Requested
              </th>
              <th className="px-4 py-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/50">
            {data.map((approval) => (
              <ApprovalRow
                key={approval._id}
                approval={approval}
                isExpanded={expandedId === approval._id}
                onToggle={() => toggleExpand(approval._id)}
                onApprove={() => approveMutation.mutate(approval._id)}
                onReject={() => rejectMutation.mutate(approval._id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Extracted Row Component to handle individual Diff fetches organically
const ApprovalRow = ({ approval, isExpanded, onToggle, onApprove, onReject }: any) => {
  // If baseVersion is null, infer this is the very first version ever created
  const baseV = approval.metadata?.baseVersion ?? 0;
  const candidateV = approval.metadata?.version ?? 0;
  const policyId = approval.metadata?.policyId;

  const diffQuery = useVersionDiff(
    isExpanded && policyId ? policyId : "",
    candidateV,
    baseV
  );

  return (
    <>
      <tr className="hover:bg-zinc-800/30 transition-colors group">
        <td className="px-4 py-3 font-mono text-zinc-300">
          {policyId}
        </td>

        <td className="px-4 py-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 font-mono text-xs text-zinc-300">
            v{baseV} &rarr; v{candidateV}
          </span>
        </td>

        <td className="px-4 py-3">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${approval.riskScore > 70 ? 'bg-red-500/10 text-red-400 border-red-500/20' :
            approval.riskScore > 30 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
            Risk: {approval.riskScore}
          </span>
        </td>

        <td className="px-4 py-3 text-zinc-400 text-xs">
          {new Date(approval.createdAt).toLocaleString()}
        </td>

        <td className="px-4 py-3 space-x-2">
          <button
            onClick={onToggle}
            className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded text-xs font-semibold transition-colors"
          >
            {isExpanded ? "Hide Details" : "Review Diffs"}
          </button>
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-zinc-900/50">
          <td colSpan={5} className="p-0 border-b border-zinc-800">
            <div className="p-6 border-l-2 border-blue-500">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Rule Modifications (v{baseV} vs v{candidateV})</h3>
                <div className="flex gap-2">
                  <button
                    onClick={onApprove}
                    className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors"
                  >
                    Approve Rollout
                  </button>

                  <button
                    onClick={onReject}
                    className="bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20 text-white px-4 py-1.5 rounded text-sm font-semibold transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {diffQuery.isLoading ? (
                <div className="text-zinc-500 text-sm animate-pulse">Calculating semantic diffs...</div>
              ) : diffQuery.isError ? (
                <div className="text-red-400 text-sm">Failed to load diffs natively.</div>
              ) : (
                <DiffViewer changes={diffQuery.data?.changes || []} />
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ApprovalConsolePage;
