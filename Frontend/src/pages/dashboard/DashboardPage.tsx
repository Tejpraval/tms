import React from 'react';
import { useDashboardData } from "./useDashboardData";
import { RiskBanner } from "@/modules/risk/components/RiskBanner";
import { RolloutCard } from "@/modules/rollout/components/RolloutCard";
import { ApprovalAgingCard } from "@/modules/policy-approval/components/ApprovalAgingCard";
import { AuditTimeline } from "@/modules/audit/components/ActivityTimeline";
import { useApprovalSlaIntelligence } from "@/modules/policy-approval/hooks/useApprovalSlaIntelligence";
import { ApprovalSlaIntelligenceCard } from "@/modules/policy-approval/components/ApprovalSlaIntelligenceCard";
import { useGovernanceRisk } from "@/modules/risk/hooks/useGovernanceRisk";
import { useGovernanceStress } from "@/modules/risk/hooks/useGovernanceStress";
import { GovernanceStressCard } from "@/modules/risk/components/GovernanceStressCard";
import { useStressVolatility } from "@/modules/risk/hooks/useStressVolatility";
import { useStressTrend } from "@/modules/risk/hooks/useStressTrend";
import { useRolloutStressCorrelation }
  from "@/modules/risk/hooks/useRolloutStressCorrelation";
import { usePredictiveAlert }
  from "@/modules/risk/hooks/usePredictiveAlert";
import { useStressSimulation } from "@/modules/risk/hooks/useStressSimulation";
import { StressSimulatorPanel } from "@/modules/risk/components/StressSimulatorPanel";
import { useStressDecomposition }
  from "@/modules/risk/hooks/useStressDecomposition";
import { useStressNarrative }
  from "@/modules/risk/hooks/useStressNarrative";
import { useStressReplay }
  from "@/modules/risk/hooks/useStressReplay";
import { useStressRecommendations }
  from "@/modules/risk/hooks/useStressRecommendations";
import { useAdaptiveStressWeights }
  from "@/modules/risk/hooks/useAdaptiveStressWeights";
import { useGovernanceHealth }
  from "@/modules/risk/hooks/useGovernanceHealth";
import { useExecutiveMode }
  from "@/modules/risk/hooks/useExecutiveMode";
import { useExecutiveReport }
  from "@/modules/risk/hooks/useExecutiveReport";
import { useRiskPersona } from "@/modules/risk/personas/useRiskPersona";
import { usePersonaNarrative } from "@/modules/risk/personas/usePersonaNarrative";
import { PersonaToggle } from "@/modules/risk/personas/PersonaToggle";
import { PersonaInsightsCard } from "@/modules/risk/personas/PersonaInsightsCard";
import { useRiskForecastTimeline }
  from "@/modules/risk/hooks/useRiskForecastTimeline";
import { useCollapseProbability }
  from "@/modules/risk/hooks/useCollapseProbability";


const DashboardPage = () => {
  const {
    policies,
    approvals,
    releases,
    audits,
    isLoading,
  } = useDashboardData();
  const slaMetrics = useApprovalSlaIntelligence(approvals);
  const { score } = useGovernanceRisk({ approvals, releases });

  const adjustedScore = Math.round(
    score * slaMetrics.riskAmplificationFactor
  );
  const { stressScore, stressTier } =
    useGovernanceStress({
      adjustedRiskScore: adjustedScore,
      slaBreachPercentage: slaMetrics.breachPercentage,
      activeRollouts: releases.length,
    });
  const {
    simulatedStress,
    breachOverride,
    rolloutOverride,
    setBreachOverride,
    setRolloutOverride,
  } = useStressSimulation({
    baseStress: stressScore,
    baseBreach: slaMetrics.breachPercentage,
    baseRollouts: releases.length,
  });

  /* ---------------- REPLAY ---------------- */

  const {
    history,
    average,
    momentum,
    sustainedTrend,
    stdDev,
    predictedNext,
  } = useStressTrend({
    currentStress: simulatedStress,
  });
  const {
    healthScore,
    healthLabel,
    healthColor,
  } = useGovernanceHealth({
    history,
    volatility: stdDev,
    sustainedTrend,
    tier: stressTier,
  });


  const {
    isReplaying,
    replayedStress,
    index,
    setIndex,
    maxIndex,
  } = useStressReplay({ history });

  /* ---------------- EFFECTIVE STRESS (FINAL SOURCE OF TRUTH) ---------------- */

  const effectiveStress =
    isReplaying && replayedStress !== null
      ? replayedStress
      : simulatedStress;

  /* ---------------- DERIVED METRICS (MUST USE effectiveStress) ---------------- */

  const { delta, trend } = useStressVolatility({
    currentStress: effectiveStress,
  });

  const {
    rolloutInfluencePercent,
  } = useRolloutStressCorrelation({
    stressScore: effectiveStress,
    volatility: stdDev,
    momentum,
    activeRollouts: rolloutOverride ?? releases.length,
  });

  const { isAlerting } = usePredictiveAlert({
    predictedNext,
  });


  const {
    basePercent,
    slaPercent,
    rolloutPercent,
    volatilityPercent,
  } = useStressDecomposition({
    stressScore: effectiveStress,
    baseRiskScore: adjustedScore,
    slaBreachPercentage:
      breachOverride ?? slaMetrics.breachPercentage,
    activeRollouts:
      rolloutOverride ?? releases.length,
    volatility: stdDev,
  });
  const {
    slaWeight,
    rolloutWeight,
    volatilityWeight,
  } = useAdaptiveStressWeights({
    history,
    slaPercent,
    rolloutPercent,
    volatilityPercent,
  });

  const calibratedSla = slaPercent * slaWeight;
  const calibratedRollout = rolloutPercent * rolloutWeight;
  const calibratedVolatility =
    volatilityPercent * volatilityWeight;







  const {
    persona,
    setPersona,
    weights: personaWeights,
  } = useRiskPersona();



  /* ---------------- PERSONA CALIBRATION ---------------- */

  const personaSla =
    calibratedSla * personaWeights.slaWeight;

  const personaRollout =
    calibratedRollout * personaWeights.rolloutWeight;

  const personaVolatility =
    calibratedVolatility *
    personaWeights.volatilityWeight;

  const personaStressScore = Math.min(
    100,
    Math.round(
      basePercent +
      personaSla +
      personaRollout +
      personaVolatility
    )
  );
  const {
    forecast: projectionTimeline,
    finalProjection,
    riskDirection,
  } = useRiskForecastTimeline({
    currentStress: personaStressScore,
    momentum,
    volatility: stdDev,
  });

  const {
    collapseProbability,
    riskLevel,
  } = useCollapseProbability({
    currentStress: effectiveStress,
    momentum,
    volatility: stdDev,
  });


  const personaNarrative = usePersonaNarrative({
    persona,
    stressScore: personaStressScore,
    predictedNext,
  });


  const { narrative } = useStressNarrative({
    stressScore: personaStressScore,
    tier: stressTier,
    momentum,
    slaPercent: calibratedSla,
    rolloutPercent: calibratedRollout,
    volatilityPercent: calibratedVolatility,
    isAlerting,
  });
  const { recommendations } = useStressRecommendations({
    tier: stressTier,
    predictedNext,
    momentum,
    slaPercent: personaSla,
    rolloutPercent: personaRollout,
    volatilityPercent: personaVolatility,
  });

  const { generate } = useExecutiveReport({
    healthScore,
    healthLabel,
    stressScore: personaStressScore,
    tier: stressTier,
    predictedNext,
    narrative,
    recommendations,
  });


  const { isExecutive, toggle } =
    useExecutiveMode();


  console.log("Executive mode:", isExecutive);


  if (isLoading) {
    return (
      <div className="p-6 text-white">
        Loading governance signals...
      </div>
    );
  }


  return (

    <div className="p-6 text-white">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-blue-400 text-2xl font-semibold">
          Governance Cockpit
        </h1>
        {isExecutive && (
          <button
            onClick={generate}
            className="text-xs bg-green-700 px-3 py-1 rounded hover:bg-green-600"
          >
            Export Executive PDF
          </button>
        )}


        <button
          onClick={toggle}
          className="text-xs bg-zinc-800 px-3 py-1 rounded hover:bg-zinc-700"
        >
          {isExecutive
            ? "Switch to Operational"
            : "Switch to Executive"}
        </button>

      </div>


      <div className="grid grid-cols-4 gap-6">

        {/* LEFT MAIN AREA */}
        <div className="col-span-3 space-y-6">
          <div className="bg-zinc-900 rounded-2xl p-6">
            <p className="text-sm opacity-70">
              30-Day Governance Health
            </p>
            <h2 className={`text-4xl font-bold ${healthColor}`}>
              {healthScore}
            </h2>
            <p className="text-sm mt-2">
              {healthLabel}
            </p>
          </div>
          <PersonaToggle
            persona={persona}
            setPersona={setPersona}
          />

          <PersonaInsightsCard
            headline={personaNarrative.headline}
          />

          {/* Risk Banner */}
          <GovernanceStressCard
            score={personaStressScore}

            tier={stressTier}
            delta={delta}
            trend={trend}
            average={average}
            momentum={momentum}
            sustainedTrend={sustainedTrend}
            history={history}
            stdDev={stdDev}
            predictedNext={predictedNext}
            rolloutInfluencePercent={rolloutInfluencePercent}
            isAlerting={isAlerting}
            basePercent={basePercent}
            slaPercent={personaSla}
            rolloutPercent={personaRollout}
            volatilityPercent={personaVolatility}
            narrative={narrative}
            recommendations={recommendations}
          />
          <div className="bg-zinc-900 rounded-2xl p-4">
            <p className="text-sm opacity-70">
              30-Day Collapse Probability
            </p>

            <h2 className="text-3xl font-bold">
              {collapseProbability}%
            </h2>

            <p className="text-sm mt-1">
              Risk Level: {riskLevel}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6">
            <p className="text-sm opacity-70 mb-2">
              30-Day Risk Projection
            </p>

            <h2 className="text-3xl font-bold">
              {finalProjection}
            </h2>

            <p className="text-sm mt-1">
              Direction: {riskDirection}
            </p>

            <div className="flex gap-1 mt-4 h-10 items-end">
              {projectionTimeline.map((value, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-500"
                  style={{
                    height: `${value}%`,
                    opacity: 0.6,
                  }}
                />
              ))}
            </div>
          </div>



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
          {!isExecutive && (
            <StressSimulatorPanel
              breach={breachOverride ?? slaMetrics.breachPercentage}
              rollouts={rolloutOverride ?? releases.length}
              setBreach={setBreachOverride}
              setRollouts={setRolloutOverride}
            />
          )}
          {!isExecutive && history.length > 1 && (
            <div className="bg-zinc-900 rounded-2xl p-4 space-y-3">
              <h2 className="text-lg font-semibold">
                Stress Replay
              </h2>

              <input
                type="range"
                min={0}
                max={maxIndex}
                value={index ?? maxIndex}
                onChange={(e) =>
                  setIndex(Number(e.target.value))
                }
                className="w-full"
              />

              <button
                onClick={() => setIndex(null)}
                className="text-xs opacity-70 hover:opacity-100"
              >
                Exit Replay
              </button>
            </div>
          )}


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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-500 bg-red-950/20 h-full w-full overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Dashboard Render Crash</h1>
          <p className="font-mono bg-black p-4 rounded text-sm whitespace-pre-wrap">{this.state.error?.toString()}</p>
          <pre className="font-mono bg-black p-4 mt-4 rounded text-xs opacity-70 whitespace-pre-wrap">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const SafeDashboardPage = () => (
  <ErrorBoundary>
    <DashboardPage />
  </ErrorBoundary>
);

export default SafeDashboardPage;
