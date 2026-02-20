import { platformMockData } from "../mock/platformData";

export const CrossTenantTrendChart = () => {
    // Only taking top 3 high-risk tenants for clarity in the summary chart
    const relevantTenants = platformMockData
        .filter((t) => t.stressScore > 50)
        .sort((a, b) => b.stressScore - a.stressScore)
        .slice(0, 3);

    const width = 100; // viewBox units
    const height = 40;

    const getPath = (history: number[]) => {
        if (!history.length) return "";
        const stepX = width / (history.length - 1);

        // Map score 0-100 to y 40-0 (inverted because SVG y increases downwards)
        const mapY = (score: number) => height - (score / 100) * height;

        return history.map((val, idx) =>
            `${idx === 0 ? 'M' : 'L'} ${idx * stepX},${mapY(val)}`
        ).join(" ");
    };

    const colors = ["stroke-red-500", "stroke-orange-500", "stroke-yellow-500"];

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col h-full">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">Stress Trend Analysis</h3>
                <p className="text-zinc-500 text-sm">14-day stress forecast for critical tenants</p>
            </div>

            <div className="flex-1 relative min-h-[150px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2" />
                    <line x1="0" y1="40" x2="100" y2="40" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2" />

                    {relevantTenants.map((tenant, idx) => (
                        <path
                            key={tenant.id}
                            d={getPath(tenant.trendHistory)}
                            fill="none"
                            className={`${colors[idx % colors.length]} stroke-[1.5px] vector-effect-non-scaling-stroke opacity-80 hover:opacity-100 transition-opacity`}
                        />
                    ))}
                </svg>

                {/* Labels */}
                <div className="absolute top-0 right-0 text-[10px] text-zinc-600">100 (Crit)</div>
                <div className="absolute top-1/2 -translate-y-1/2 right-0 text-[10px] text-zinc-600">50 (Med)</div>
                <div className="absolute bottom-0 right-0 text-[10px] text-zinc-600">0 (Low)</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-4">
                {relevantTenants.map((tenant, idx) => (
                    <div key={tenant.id} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-0.5 ${colors[idx % colors.length].replace('stroke-', 'bg-')}`} />
                        <span className="text-zinc-300">{tenant.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
