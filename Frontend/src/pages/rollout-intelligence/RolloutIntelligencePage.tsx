//D:\resumeproject\Frontend\src\pages\rollout-intelligence\RolloutIntelligencePage.tsx
import { useDashboardData } from "../dashboard/useDashboardData";
import { RolloutIntelligenceCard } 
  from "@/modules/rollout/components/RolloutIntelligenceCard";

const RolloutIntelligencePage = () => {

  const { releases } = useDashboardData();

  const baseStress = 65;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold mb-6">
        Rollout Intelligence
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {releases.map((release) => (
          <RolloutIntelligenceCard
            key={release._id}
            release={release}
            baseStress={baseStress}
          />
        ))}
      </div>
    </div>
  );
};

export default RolloutIntelligencePage;
