import React from "react";

interface RiskTrendChartProps {
    data: { date: string; score: number }[];
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ data }) => {
    // If no data, show empty state
    if (!data || data.length === 0) {
        return (
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm h-full flex flex-col justify-center items-center h-[240px]">
                <svg className="w-8 h-8 text-zinc-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p className="text-zinc-500 text-sm">No risk trend data available for the last 30 days.</p>
            </div>
        );
    }

    // Determine min/max for scaling natively
    const scores = data.map(d => d.score);
    const maxScore = Math.max(...scores, 100); // Scale up to at least 100
    const minScore = 0;

    return (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm h-full flex flex-col content-start">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Historical Risk Trend</h3>

            <div className="relative flex-1 items-end flex gap-1 h-[150px] mt-auto">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                    <div className="border-b border-zinc-800/50 w-full h-0" />
                    <div className="border-b border-zinc-800/50 w-full h-0" />
                    <div className="border-b border-zinc-800 w-full h-0" />
                </div>

                {/* Bars Plot */}
                {data.map((point) => {
                    const heightPercent = Math.max(((point.score - minScore) / (maxScore - minScore)) * 100, 2); // At least 2% height so it's visible if score 0

                    // Color mapping based on risk
                    let colorClass = "bg-emerald-500";
                    if (point.score > 25) colorClass = "bg-yellow-500";
                    if (point.score > 50) colorClass = "bg-amber-500";
                    if (point.score > 75) colorClass = "bg-red-500";

                    return (
                        <div key={point.date} className="flex-1 flex flex-col justify-end group relative z-10 h-full">
                            {/* Tooltip on hover */}
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-xs text-white px-2 py-1 rounded shadow pointer-events-none transition-opacity whitespace-nowrap z-20">
                                {point.date}: {point.score}
                            </div>

                            {/* Bar segment */}
                            <div
                                className={`w-full ${colorClass} rounded-t-sm opacity-60 group-hover:opacity-100 transition-opacity`}
                                style={{ height: `${heightPercent}%` }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
