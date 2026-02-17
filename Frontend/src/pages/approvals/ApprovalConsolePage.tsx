//D:\resumeproject\Frontend\src\pages\approvals\ApprovalConsolePage.tsx
import {
  usePendingApprovals,
  useApproveApproval,
  useRejectApproval,
} from "@/modules/policy-approval/hooks";

const ApprovalConsolePage = () => {
  const { data, isLoading } = usePendingApprovals();
  const approveMutation = useApproveApproval();
  const rejectMutation = useRejectApproval();

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

          <tbody>
            {data.map((approval) => (
              <tr
                key={approval._id}
                className="border-t border-zinc-800"
              >
                <td className="px-4 py-3">
                  {approval.metadata?.policyId}
                </td>

                <td className="px-4 py-3">
                  v{approval.metadata?.version ?? 0}
                </td>

                <td className="px-4 py-3">
                  {approval.riskScore}
                </td>

                <td className="px-4 py-3 text-zinc-400">
                  {new Date(
                    approval.createdAt
                  ).toLocaleString()}
                </td>

                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() =>
                      approveMutation.mutate(
                        approval._id
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-semibold"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      rejectMutation.mutate(
                        approval._id
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs font-semibold"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalConsolePage;
