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
    predictedNext
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

  const max = history.length > 0 ? Math.max(...history) : 1;
const min = history.length > 0 ? Math.min(...history) : 0;


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

  return (
   <div
  className={`
    ${color}
    rounded-2xl p-6 relative overflow-hidden
    ${tier === "CRITICAL" ? "animate-pulse" : ""}
  `}
  style={
    tier === "CRITICAL"
      ? {
          boxShadow: `0 0 ${30 * volatilityIntensity}px rgba(255,0,0,${
            0.4 * volatilityIntensity
          })`,
        }
      : undefined
  }
>

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

  {/* Last point highlight */}
{history.length > 0 && (
  <circle
    cx={width}
    cy={
      height -
      ((predictedNext - min) /
        Math.max(max - min, 1)) *
        height
    }
    r="3"
    fill="yellow"
  />
)}

</svg>

    </div>
  );
};
