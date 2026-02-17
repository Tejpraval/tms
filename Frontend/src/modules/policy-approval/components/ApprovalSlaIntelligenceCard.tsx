import type { ApprovalSlaMetrics } from "../sla.utils";

interface Props {
  metrics: ApprovalSlaMetrics;
}

export const ApprovalSlaIntelligenceCard = ({
  metrics,
}: Props) => {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-4">
      <h2 className="text-lg font-semibold">
        Approval SLA Intelligence
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-zinc-400">Avg Age</p>
          <p className="text-xl font-bold">
            {metrics.averageAgeHours.toFixed(1)}h
          </p>
        </div>

        <div>
          <p className="text-zinc-400">SLA Breach %</p>
          <p className="text-xl font-bold text-red-400">
            {metrics.breachPercentage.toFixed(0)}%
          </p>
        </div>

        <div>
          <p className="text-zinc-400">Breached</p>
          <p className="text-xl font-bold">
            {metrics.breachCount}
          </p>
        </div>

        <div>
          <p className="text-zinc-400">Risk Multiplier</p>
          <p className="text-xl font-bold text-orange-400">
            x{metrics.riskAmplificationFactor.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
        <p>Healthy: {metrics.severityDistribution.HEALTHY}</p>
        <p>Warning: {metrics.severityDistribution.WARNING}</p>
        <p>Breached: {metrics.severityDistribution.BREACH}</p>
        <p>Critical: {metrics.severityDistribution.CRITICAL}</p>
      </div>
    </div>
  );
};
