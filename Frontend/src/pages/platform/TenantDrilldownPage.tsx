import { useParams, Link } from "react-router-dom";
import { platformMockData } from "@/modules/platform/mock/platformData";

const TenantDrilldownPage = () => {
    const { tenantId } = useParams();
    const tenant = platformMockData.find((t) => t.id === tenantId);

    if (!tenant) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <h2 className="text-xl font-semibold mb-2">Tenant Not Found</h2>
                <Link to="/platform-overview" className="text-blue-400 hover:underline">Return to Overview</Link>
            </div>
        );
    }

    const getTierBadge = (tier: string) => {
        switch (tier) {
            case "Critical": return "bg-red-500/10 text-red-400 border-red-500/20";
            case "High": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            case "Medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            default: return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Link to="/platform-overview" className="hover:text-zinc-300 transition">Platform Overview</Link>
                <span>/</span>
                <span className="text-zinc-200">{tenant.name}</span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{tenant.name}</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-zinc-400 text-sm">{tenant.sector} Sector</span>
                        <span className={`px-2 py-0.5 border rounded-full text-xs ${getTierBadge(tenant.riskTier)}`}>
                            {tenant.riskTier} Risk
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-zinc-500 mb-1">Governance Stress Score</div>
                    <div className={`text-3xl font-bold ${tenant.stressScore > 50 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {tenant.stressScore}
                        <span className="text-base font-normal text-zinc-600 ml-1">/ 100</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg">
                    <div className="text-zinc-500 text-sm uppercase tracking-wider mb-2">Active Rollouts</div>
                    <div className="text-2xl font-bold text-blue-400">{tenant.activeRollouts}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg">
                    <div className="text-zinc-500 text-sm uppercase tracking-wider mb-2">Pending Approvals</div>
                    <div className="text-2xl font-bold text-orange-400">{tenant.pendingApprovals}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-lg">
                    <div className="text-zinc-500 text-sm uppercase tracking-wider mb-2">Platform Health</div>
                    <div className="text-2xl font-bold text-emerald-400">{tenant.healthScore}%</div>
                </div>
            </div>

            {/* Narrative & Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-4">Risk Narrative</h3>
                        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
                            <p>
                                Current analysis indicates elevated governance stress primarily driven by <strong className="text-white">rapid rollout velocity</strong> combined with accumulated policy drift in the {tenant.sector} compliance framework.
                            </p>
                            <p>
                                Pending approvals have increased by 15% over the last 7 days, creating a potential bottleneck. Recommend immediate review of the "Standard Deployment Policy" to alleviate queue pressure.
                            </p>
                        </div>
                    </div>

                    {/* Mock Forecast Chart Area */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-4">30-Day Risk Forecast</h3>
                        <div className="h-48 flex items-end justify-between px-4 pb-2 border-b border-l border-zinc-800">
                            {tenant.trendHistory.map((val, idx) => (
                                <div key={idx} className="w-full mx-1 bg-indigo-500/20 rounded-t relative group">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t transition-all group-hover:bg-indigo-400"
                                        style={{ height: `${val}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                        <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Executive Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-3 bg-zinc-950 border border-zinc-800 rounded hover:bg-zinc-800 hover:border-zinc-700 transition text-sm text-zinc-300">
                                Generate Audit Report
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-zinc-950 border border-zinc-800 rounded hover:bg-zinc-800 hover:border-zinc-700 transition text-sm text-zinc-300">
                                View Active Policies
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-zinc-950 border border-zinc-800 rounded hover:bg-zinc-800 hover:border-zinc-700 transition text-sm text-zinc-300">
                                Contact Tenant Admin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantDrilldownPage;
