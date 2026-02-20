import { useDashboardData } from "@/pages/dashboard/useDashboardData";
import { useGovernanceRisk } from "@/modules/risk/hooks/useGovernanceRisk";
import { Link } from "react-router-dom";

export default function TenantDashboardPage() {
    const { policies, approvals, releases, audits, isLoading } = useDashboardData();
    const { score } = useGovernanceRisk({ approvals, releases });

    if (isLoading) {
        return (
            <div className="p-8 text-white flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-emerald-500 font-mono">Loading Tenant Telemetry...</span>
            </div>
        );
    }

    const tier = score > 75 ? "Critical" : score > 50 ? "High" : score > 25 ? "Medium" : "Low";
    const tierColor = score > 75 ? "text-red-400" : score > 50 ? "text-yellow-400" : "text-emerald-400";

    return (
        <div className="p-8 text-white max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-mono text-emerald-400 mb-1">Tenant Overview</h1>
                <p className="text-zinc-400 text-sm">Real-time operational status for your isolated workspace.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Risk Score */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Live Risk Score</h3>
                    <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-bold font-mono ${tierColor}`}>{Math.round(score)}</span>
                        <span className={`text-sm font-bold uppercase ${tierColor}`}>{tier}</span>
                    </div>
                </div>

                {/* Policies Count */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Managed Policies</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold font-mono text-blue-400">{policies.length}</span>
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Pending Approvals</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold font-mono text-yellow-400">{approvals.length}</span>
                    </div>
                </div>

                {/* Active Rollouts */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg">
                    <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Active Rollouts</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold font-mono text-purple-400">{releases.length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Rollouts Panel */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="font-semibold text-zinc-300">Active Distributions</h3>
                        <Link to="/rollouts" className="text-xs text-blue-400 hover:text-blue-300">View All →</Link>
                    </div>
                    <div className="p-6 flex-1 overflow-auto">
                        {releases.length === 0 ? (
                            <div className="text-center text-zinc-500 text-sm py-8">No active policy rollouts.</div>
                        ) : (
                            <div className="space-y-4">
                                {releases.slice(0, 3).map(r => (
                                    <div key={r._id} className="bg-black border border-zinc-800 p-4 rounded-md">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-blue-300">{r.policyId}</span>
                                            <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">{r.status}</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-1 mt-3">
                                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${r.rolloutPercentage}%` }} />
                                        </div>
                                        <div className="text-right text-xs text-zinc-500 font-mono">{r.rolloutPercentage}% Complete</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Audit Panel */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                        <h3 className="font-semibold text-zinc-300">Recent Audit Log</h3>
                        <Link to="/tenant-audit" className="text-xs text-emerald-400 hover:text-emerald-300">View Stream →</Link>
                    </div>
                    <div className="p-0 flex-1 overflow-auto">
                        {audits.length === 0 ? (
                            <div className="text-center text-zinc-500 text-sm py-12">No recent audit events.</div>
                        ) : (
                            <div className="divide-y divide-zinc-800/50">
                                {audits.slice(0, 5).map(a => (
                                    <div key={a._id} className="px-6 py-3 flex items-center justify-between hover:bg-zinc-800/30">
                                        <div>
                                            <div className="font-medium text-sm text-zinc-200">{a.action}</div>
                                            <div className="text-xs text-zinc-500 mt-0.5">{new Date(a.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded border ${a.outcome === "ALLOW" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                    a.outcome === "DENY" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                        "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                }`}>
                                                {a.outcome}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
