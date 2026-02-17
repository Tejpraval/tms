//D:\resumeproject\Frontend\src\pages\dashboard\DashboardPage.tsx
import { useDashboardData } from "./useDashboardData";
import { RiskBanner } from "@/modules/risk/components/RiskBanner";
import { RolloutCard } from "@/modules/rollout/components/RolloutCard";
import { ApprovalAgingCard } from "@/modules/policy-approval/components/ApprovalAgingCard";
import { AuditTimeline } from "@/modules/audit/components/ActivityTimeline";
import { useApprovalSlaIntelligence } from "@/modules/policy-approval/hooks/useApprovalSlaIntelligence";
import { ApprovalSlaIntelligenceCard } from "@/modules/policy-approval/components/ApprovalSlaIntelligenceCard";


const DashboardPage = () => {
  const {
    policies,
    approvals,
    releases,
    audits,
    isLoading,
  } = useDashboardData();
    const slaMetrics = useApprovalSlaIntelligence(approvals);
  if (isLoading) {
    return (
      <div className="p-6 text-white">
        Loading governance signals...
      </div>
    );
  }


  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6">
        Governance Cockpit
      </h1>

      <div className="grid grid-cols-4 gap-6">
        
        {/* LEFT MAIN AREA */}
        <div className="col-span-3 space-y-6">
          
          {/* Risk Banner */}
          <RiskBanner
           approvals={approvals}
            releases={releases}
            slaMultiplier={slaMetrics.riskAmplificationFactor}
          /> 
          <ApprovalSlaIntelligenceCard metrics={slaMetrics} />

          {/* KPI Grid */}
          <div className="grid grid-cols-3 gap-4">
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
          </div>

          {/* Rollout Section */}
          {releases.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
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
        </div>

        {/* RIGHT SIGNAL PANEL */}
        <div className="col-span-1 space-y-6">
          
          {/* Pending Approvals */}
          {approvals.length > 0 && (
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 space-y-4">
              <h2 className="text-lg font-semibold">
                Pending Approvals
              </h2>

              <div className="space-y-3">
                {approvals.slice(0, 5).map((approval) => (
                  <ApprovalAgingCard
                    key={approval._id}
                    approval={approval}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Activity Stream */}
          {audits.length > 0 && (
            <AuditTimeline audits={audits} />
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
