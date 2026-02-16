import { useDashboardData } from "./useDashboardData";
import { RiskBanner } from "@/modules/risk/components/RiskBanner";
import { RolloutCard } from "@/modules/rollout/components/RolloutCard";
import { ApprovalAgingCard } from "@/modules/policy-approval/components/ApprovalAgingCard";

const DashboardPage = () => {
  const {
    policies,
    approvals,
    releases,
    audits,
    isLoading,
  } = useDashboardData();

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        Loading governance signals...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 text-white">
      <h1 className="text-2xl font-semibold">
        Governance Dashboard
      </h1>

      {/* Risk Banner */}
      <RiskBanner
        pendingApprovals={approvals.length}
        activeRollouts={releases.length}
        totalPolicies={policies.length}
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-sm text-zinc-400">
            Total Policies
          </p>
          <p className="text-2xl font-bold">
            {policies.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-sm text-zinc-400">
            Pending Approvals
          </p>
          <p className="text-2xl font-bold text-yellow-400">
            {approvals.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-sm text-zinc-400">
            Active Rollouts
          </p>
          <p className="text-2xl font-bold text-blue-400">
            {releases.length}
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p className="text-sm text-zinc-400">
            Recent Audit Events
          </p>
          <p className="text-2xl font-bold text-emerald-400">
            {audits.length}
          </p>
        </div>
      </div>

      {/* Rollout Section */}
      {releases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Active Rollouts
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {releases.map((release) => (
              <RolloutCard
                key={release._id}
                release={release}
              />
            ))}
          </div>
        </div>
      )}

      {/* Approval Section */}
      {approvals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Pending Approvals
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {approvals.map((approval) => (
              <ApprovalAgingCard
                key={approval._id}
                approval={approval}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
