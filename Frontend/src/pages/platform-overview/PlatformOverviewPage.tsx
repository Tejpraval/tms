import { useEffect, useState } from "react";
import { CrossTenantTrendChart } from "@/modules/platform/components/CrossTenantTrendChart";
import { TenantRiskMatrix } from "@/modules/platform/components/TenantRiskMatrix";

interface IntelligenceSummary {
    governance: {
        simulations: { total: number; latencyP95: number };
        approvals: { approved: number; rejected: number; escalated: number };
        rollouts: { active: number; failures: number };
        risk: { low: number; medium: number; high: number; critical: number };
    };
    observabilityStatus: string;
}

const PlatformOverviewPage = () => {
    const [data, setData] = useState<IntelligenceSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIntelligence = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                // Use relative path via proxy
                const response = await fetch('/api/platform/intelligence-summary', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 403) throw new Error("Access Denied: Platform Admin only");
                    const errorText = await response.text().catch(() => response.statusText);
                    throw new Error(`Failed to fetch intelligence (${response.status}): ${errorText}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIntelligence();
    }, []);

    if (loading) {
        return <div className="p-10 text-zinc-500 animate-pulse">Loading intelligence stream...</div>;
    }

    if (error) {
        return (
            <div className="p-6 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400">
                <h3 className="font-semibold">Intelligence Stream Error</h3>
                <p className="text-sm mt-1">{error}</p>
            </div>
        );
    }

    const metrics = data?.governance;

    // 🟢 Executive Calculations
    const totalApprovals = (metrics?.approvals.approved || 0) + (metrics?.approvals.rejected || 0) + (metrics?.approvals.escalated || 0);
    const approvalRate = totalApprovals > 0 ? ((metrics?.approvals.approved || 0) / totalApprovals) * 100 : 0;

    const totalRisk = (metrics?.risk.low || 0) + (metrics?.risk.medium || 0) + (metrics?.risk.high || 0) + (metrics?.risk.critical || 0);
    const riskLowPct = totalRisk > 0 ? ((metrics?.risk.low || 0) / totalRisk) * 100 : 0;
    const riskMedPct = totalRisk > 0 ? ((metrics?.risk.medium || 0) / totalRisk) * 100 : 0;
    const riskHighPct = totalRisk > 0 ? (((metrics?.risk.high || 0) + (metrics?.risk.critical || 0)) / totalRisk) * 100 : 0;

    // 🚦 Status Indicators
    const latencyVal = metrics?.simulations.latencyP95 || 0;
    const isPerformanceOptimal = latencyVal < 0.2;
    const isRolloutHealthy = (metrics?.rollouts.failures || 0) === 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                        <div className={`w-1.5 h-1.5 rounded-full ${data?.observabilityStatus === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                        {data?.observabilityStatus === 'active' ? 'Live Stream' : 'Offline'}
                    </span>
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded transition">
                        Export Report
                    </button>
                </div>
            </div>

            {/* 📊 Executive KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* 1. Simulations & Performance */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                    <div className="flex justify-between items-start">
                        <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Simulations</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${isPerformanceOptimal ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                            {isPerformanceOptimal ? 'OPTIMAL' : 'ATTENTION'}
                        </span>
                    </div>
                    <div className="text-3xl font-bold mt-2 text-blue-400">{metrics?.simulations.total}</div>
                    <div className="mt-2 text-xs text-zinc-500">
                        Avg Latency: <span className="text-zinc-300">{(latencyVal * 1000).toFixed(0)}ms</span>
                    </div>
                </div>

                {/* 2. Rollout Health */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                    <div className="flex justify-between items-start">
                        <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Rollout Health</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${isRolloutHealthy ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            {isRolloutHealthy ? 'HEALTHY' : 'DEGRADED'}
                        </span>
                    </div>
                    <div className={`text-3xl font-bold mt-2 ${isRolloutHealthy ? 'text-emerald-400' : 'text-red-400'}`}>
                        {metrics?.rollouts.failures === 0 ? '100%' : `${metrics?.rollouts.failures} Failures`}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                        Active Stages: <span className="text-zinc-300">{metrics?.rollouts.active}</span>
                    </div>
                </div>

                {/* 3. Approval Success */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
                    <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Approval Rate</span>
                    <div className="text-3xl font-bold mt-2 text-purple-400">{approvalRate.toFixed(1)}%</div>
                    <div className="mt-2 text-xs text-zinc-500">
                        {metrics?.approvals.approved} Approved / {totalApprovals} Decisions
                    </div>
                </div>

                {/* 4. Risk Segmentation */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between">
                    <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Risk Segmentation</span>

                    <div className="flex w-full h-4 rounded overflow-hidden mt-3 bg-zinc-800">
                        {riskLowPct > 0 && <div style={{ width: `${riskLowPct}%` }} className="bg-emerald-500" title={`Low: ${Math.round(riskLowPct)}%`} />}
                        {riskMedPct > 0 && <div style={{ width: `${riskMedPct}%` }} className="bg-yellow-500" title={`Medium: ${Math.round(riskMedPct)}%`} />}
                        {riskHighPct > 0 && <div style={{ width: `${riskHighPct}%` }} className="bg-red-500" title={`High/Critical: ${Math.round(riskHighPct)}%`} />}
                    </div>

                    <div className="flex justify-between text-[10px] text-zinc-400 mt-2">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> {Math.round(riskLowPct)}%</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /> {Math.round(riskMedPct)}%</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> {Math.round(riskHighPct)}%</div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                    {/* Retaining mock charts for now as per instructions to only replace mapped fields */}
                    <CrossTenantTrendChart />
                    <TenantRiskMatrix />
                </div>

                {/* Simplified right panel for System Activity Stream mock */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">System Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3 text-sm border-b border-zinc-800/50 pb-3 last:border-0">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                <div>
                                    <div className="text-zinc-300">
                                        Tenant <span className="font-medium text-white">Acme Corp</span> {i % 2 === 0 ? 'simulated' : 'deployed'} policy
                                    </div>
                                    <div className="text-zinc-500 text-xs mt-1">
                                        {i * 5} mins ago
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformOverviewPage;
