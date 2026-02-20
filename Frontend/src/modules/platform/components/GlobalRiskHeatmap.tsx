import { useNavigate } from "react-router-dom";
import { platformMockData } from "../mock/platformData";

export const GlobalRiskHeatmap = () => {
    const navigate = useNavigate();

    const getCellColor = (score: number) => {
        if (score >= 80) return "bg-red-500/20 border-red-500/30 hover:bg-red-500/30";
        if (score >= 60) return "bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30";
        if (score >= 40) return "bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30";
        return "bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30";
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-red-400";
        if (score >= 60) return "text-orange-400";
        if (score >= 40) return "text-yellow-400";
        return "text-emerald-400";
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">Global Risk Heatmap</h3>
                    <p className="text-zinc-500 text-sm">Real-time stress posture across all tenants</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" />Stable</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" />Elevated</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" />Critical</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {platformMockData.map((tenant) => (
                    <div
                        key={tenant.id}
                        onClick={() => navigate(`/platform/tenant/${tenant.id}`)}
                        className={`
              relative p-4 rounded-md border cursor-pointer transition-all duration-200
              ${getCellColor(tenant.stressScore)}
              hover:scale-[1.02] hover:shadow-lg hover:shadow-black/50
            `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-zinc-200 truncate pr-2" title={tenant.name}>{tenant.name}</span>
                            <span className={`text-xs font-bold ${getScoreColor(tenant.stressScore)}`}>
                                {tenant.stressScore}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-400">
                                <span>Active Rollouts</span>
                                <span className="text-zinc-300">{tenant.activeRollouts}</span>
                            </div>
                            <div className="flex justify-between text-[10px] text-zinc-400">
                                <span>Pending Approvals</span>
                                <span className="text-zinc-300">{tenant.pendingApprovals}</span>
                            </div>
                        </div>

                        {/* Micro-score bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800/50 rounded-b-md overflow-hidden">
                            <div
                                className={`h-full ${getScoreColor(tenant.stressScore).replace('text-', 'bg-')}`}
                                style={{ width: `${tenant.stressScore}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
