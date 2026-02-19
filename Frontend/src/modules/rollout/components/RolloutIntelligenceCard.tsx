import { useRolloutImpact } 
  from "@/modules/rollout/hooks/useRolloutImpact";

// interface PolicyRef {
//   name?: string;
// }

interface Release {
  _id: string;
  policyId: string; // backend sends string
}

interface Props {
  release: Release;
  baseStress: number;
}


export const RolloutIntelligenceCard = ({
  release,
  baseStress,
}: Props) => {

  const { projectedStress, delta, riskLevel } =
    useRolloutImpact({
      baseStress,
      rolloutSize: 40,
      slaSensitivity: 25,
      volatility: 12,
    });

  const color =
    riskLevel === "HIGH"
      ? "bg-red-700"
      : riskLevel === "MODERATE"
      ? "bg-yellow-600"
      : "bg-green-700";

  return (
    <div className={`${color} rounded-2xl p-6`}>
      <h2 className="text-lg font-semibold mb-2">
        Policy {release.policyId.slice(0, 6)}
      </h2>

      <p className="text-3xl font-bold">
        {projectedStress}
      </p>

      <p className="text-sm mt-2">
        Impact Δ {delta >= 0 ? "+" : ""}
        {delta}
      </p>

      <p className="text-xs mt-1">
        Risk Level: {riskLevel}
      </p>
    </div>
  );
};
