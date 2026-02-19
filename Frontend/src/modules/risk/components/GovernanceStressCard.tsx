//D:\resumeproject\Frontend\src\modules\risk\components\GovernanceStressCard.tsx
interface Props {
  score: number;
  tier: "STABLE" | "ELEVATED" | "CRITICAL";
  delta: number;
  trend: "STABLE" | "RISING" | "SPIKING";
  average: number;
  momentum: number;
  sustainedTrend: "STABLE" | "ESCALATING" | "DEESCALATING";
  history: number[];
    stdDev: number;
    predictedNext: number;
    rolloutInfluencePercent: number;
    isAlerting?: boolean;
    forecast?: number[];
    basePercent: number;
slaPercent: number;
rolloutPercent: number;
volatilityPercent: number; 
narrative: string;
recommendations: string[];



}

export const GovernanceStressCard = ({
  score,
  tier,
  delta,
  trend,
  average,
  momentum,
  sustainedTrend,
  history,
  stdDev,
    predictedNext,
    rolloutInfluencePercent,
    isAlerting = false,
    forecast = [], 
    basePercent,
    slaPercent,
    rolloutPercent,
    volatilityPercent, 
    narrative,
    recommendations,
}: Props) => {
  const color =
    tier === "STABLE"
      ? "bg-green-700"
      : tier === "ELEVATED"
      ? "bg-yellow-600"
      : "bg-red-700";

  // ---------- Sparkline logic ----------
  const width = 200;
  const height = 50;

 const combined = [...history, ...forecast];

const max = combined.length > 0 ? Math.max(...combined) : 1;
const min = combined.length > 0 ? Math.min(...combined) : 0;



  const points = history
    .map((value, index) => {
      const x =
        (index / Math.max(history.length - 1, 1)) * width;

      const normalized =
        (value - min) / Math.max(max - min, 1);

      const y = height - normalized * height;

      return `${x},${y}`;
    })
    .join(" ");
  const volatilityIntensity = Math.min(stdDev / 40, 1); 
   const forecastPoints = forecast
  .map((value, index) => {
    const x =
      ((history.length + index) /
        Math.max(history.length + forecast.length - 1, 1)) *
      width;

    const normalized =
      (value - min) / Math.max(max - min, 1);

    const y = height - normalized * height;

    return `${x},${y}`;
  })
  .join(" ");

  return (
   <div
  className={`
    ${color}
    rounded-2xl p-6 relative overflow-hidden
    ${tier === "CRITICAL" ? "animate-pulse" : ""}
  `}
 style={
  isAlerting
    ? {
        boxShadow:
          "0 0 60px rgba(255,0,0,0.6)",
      }
    : tier === "CRITICAL"
    ? {
        boxShadow: `0 0 ${30 * volatilityIntensity}px rgba(255,0,0,${
          0.4 * volatilityIntensity
        })`,
      }
    : undefined
}

>  
 {isAlerting && (
  <div className="absolute top-0 left-0 w-full bg-black/30 text-white text-xs font-bold tracking-wider px-4 py-1">
    ⚠ Predictive Alert: Stress expected to breach critical threshold
  </div>
)}


      <p className="text-sm opacity-80">
        Governance Stress Index
      </p>

      <h2 className="text-4xl font-bold">
        {score}
      </h2>

      <p className="mt-2 text-sm">
        Δ {delta >= 0 ? "+" : ""}
        {delta}
      </p>

      <p className="text-sm">
        Avg: {average}
      </p>

      <p className="text-sm">
        Momentum: {momentum >= 0 ? "+" : ""}
        {momentum}
      </p>
<p
  className={`text-sm font-semibold ${
    predictedNext > score
      ? "text-red-200"
      : predictedNext < score
      ? "text-green-200"
      : "text-white"
  }`}
>
  Next (forecast): {predictedNext}
</p>



      <p className="font-semibold mb-4">
        {tier} · {trend} · {sustainedTrend}
      </p>



      {/* -------- Sparkline -------- */}
<svg
  width="100%"
  height="60"
  viewBox={`0 0 ${width} ${height}`}
>
  <defs>
    <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={
  tier === "STABLE"
    ? "#22c55e"
    : tier === "ELEVATED"
    ? "#eab308"
    : "white"
}
 stopOpacity="0.4" />
      <stop offset="100%"stopColor={
  tier === "STABLE"
    ? "#22c55e"
    : tier === "ELEVATED"
    ? "#eab308"
    : "white"
}
 stopOpacity="0" />
    </linearGradient>
  </defs>
        {/* Volatility band */}
{history.length > 1 && (
  <rect
    x="0"
    y={
      height -
      ((average + stdDev - min) /
        Math.max(max - min, 1)) *
        height
    }
    width={width}
    height={
      ((stdDev * 2) /
        Math.max(max - min, 1)) *
      height
    }
    fill="white"
    opacity="0.08"
  />
)}

  {/* Area fill */}
  <polygon
    fill="url(#stressGradient)"
    points={`0,${height} ${points} ${width},${height}`}
  />

  {/* Line */}
  <polyline
    fill="none"
   stroke={
  tier === "STABLE"
    ? "#22c55e"
    : tier === "ELEVATED"
    ? "#eab308"
    : "#ffffff"
}

    strokeWidth="2"
    points={points}
  /> 
  {/* Forecast line */}
{forecast.length > 0 && history.length > 0 && (
  <polyline
    fill="none"
    stroke="yellow"
    strokeWidth="2"
    strokeDasharray="4 4"
    points={`
      ${points.split(" ").slice(-1)[0]}
      ${forecastPoints}
    `}
  />
)}

{forecast.length > 0 && (
  <circle
    cx={
      ((history.length + forecast.length - 1) /
        Math.max(history.length + forecast.length - 1, 1)) *
      width
    }
    cy={
      height -
      ((forecast[forecast.length - 1] - min) /
        Math.max(max - min, 1)) *
        height
    }
    r="4"
    fill="yellow"
  />
)}





</svg> 
<div className="mt-5 space-y-2">
  <p className="text-xs uppercase tracking-wider opacity-80">
    Stress Composition
  </p>

  {[
    { label: "Base Risk", value: basePercent },
    { label: "SLA Pressure", value: slaPercent },
    { label: "Rollout Pressure", value: rolloutPercent },
    { label: "Volatility Boost", value: volatilityPercent },
  ].map((item) => (
    <div key={item.label}>
      <div className="flex justify-between text-xs">
        <span>{item.label}</span>
        <span>{item.value}%</span>
      </div>
      <div className="w-full h-2 bg-white/20 rounded-full mt-1">
        <div
          className="h-2 bg-white rounded-full"
          style={{ width: `${item.value}%` }}
        />
      </div>
    </div>
  ))}
</div> 
<div className="mt-6 p-3 bg-black/20 rounded-lg text-sm opacity-90">
  {narrative}
</div> 
{recommendations.length > 0 && (
  <div className="mt-6 space-y-2">
    <p className="text-sm font-semibold">
      Recommended Actions
    </p>
    {recommendations.map((rec, i) => (
      <div
        key={i}
        className="text-sm bg-black/20 p-2 rounded"
      >
        • {rec}
      </div>
    ))}
  </div>
)}



{rolloutInfluencePercent > 0 && (
  <div className="mt-3">
    <p className="text-sm">
      Rollout Influence: {rolloutInfluencePercent}%
    </p>

    <div className="w-full h-2 bg-white/20 rounded-full mt-1">
      <div
        className="h-2 bg-white rounded-full"
        style={{
          width: `${rolloutInfluencePercent}%`,
        }}
      />
    </div>
  </div>
)}

    </div>
  );
};
