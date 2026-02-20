//D:\resumeproject\Frontend\src\pages\policies\PolicyDetailsPage.tsx
import { usePolicyDetails } from "@/modules/policy-versioning/hooks";
import { PolicyHeader } from "@/modules/policy-versioning/components/PolicyHeader";
import { PolicyMetaCard } from "@/modules/policy-versioning/components/PolicyMetaCard";
import { VersionTimeline } from "@/modules/policy-versioning/components/VersionTimeline";
//import { PolicyTabs } from "@/modules/policy-versioning/components/PolicyTabs";
import { VersionActionsPanel } from "@/modules/policy-versioning/components/VersionActionsPanel";
import { RolloutStatusPanel } from "@/modules/rollout/components/RolloutStatusPanel";
import { usePolicyRelease } from "@/modules/rollout/hooks";

const PolicyDetailsPage = () => {
  const { policy, versions, isLoading } = usePolicyDetails();
  const releaseQuery = usePolicyRelease(policy?._id);
  if (isLoading) {
    return (
      <div className="p-6 text-white">
        Loading policy control surface...
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="p-6 text-red-400">
        Policy not found.
      </div>
    );
  }


  const latestVersion =
    versions.length > 0
      ? versions.reduce((prev, curr) =>
        curr.version > prev.version ? curr : prev
      )
      : undefined;

  return (
    <div className="p-6 space-y-6 text-white">
      <PolicyHeader policy={policy} />

      <PolicyMetaCard policy={policy} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <VersionTimeline
            versions={versions}
            activeVersion={policy.activeVersion ?? 0}
            release={releaseQuery.data}
          />


        </div>
        {/* //right column for actions and rollout status */}
        <div className="space-y-6">

          {releaseQuery.data && policy.releaseMode === "ROLLOUT" && (
            <RolloutStatusPanel release={releaseQuery.data} />
          )}


          {latestVersion && policy.activeVersion && (
            <VersionActionsPanel
              policyId={policy._id}
              version={latestVersion}
              activeVersion={policy.activeVersion}
            />
          )}

        </div>

      </div>
      <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
          Governance Signals
        </h3>

        <p className="text-xs text-zinc-500 mt-2">
          Audit trail integration coming soon.
        </p>
      </div>

    </div>

  );
};

export default PolicyDetailsPage;
