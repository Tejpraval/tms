import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";

interface Tenant {
    _id: string;
    name: string;
}

interface PolicyRelease {
    _id: string;
    tenantId: string;
    policyId: string;
    candidateVersionId: string;
    rolloutPercentage: number;
    status: string;
    anomalyScore?: number;
    expansionHistory: { riskScoreSnapshot: number }[];
    stages: number[];
}

export default function CrossTenantRolloutsPage() {
    const [releases, setReleases] = useState<PolicyRelease[]>([]);
    const [tenants, setTenants] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch Tenants for Name Mapping
            const { data: tenantData } = await apiClient.get<{ data?: Tenant[] } | Tenant[]>("/tenant");
            const tenantList = Array.isArray(tenantData) ? tenantData : tenantData.data || [];

            const tenantMap: Record<string, string> = {};
            tenantList.forEach((t: Tenant) => {
                tenantMap[t._id] = t.name;
            });
            setTenants(tenantMap);

            // Fetch Active Releases
            const { data: releaseData } = await apiClient.get(API.RELEASE.ACTIVE);
            setReleases(releaseData.data || []);
        } catch (err: any) {
            console.error("Failed to fetch cross-tenant rollouts", err);
            setError(err.message || "Failed to load active rollouts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const handlePromote = async (release: PolicyRelease) => {
        if (!window.confirm(`Are you sure you want to promote rollout for ${release.policyId}?`)) return;

        // Determine next stage
        const currentStageIdx = release.stages.indexOf(release.rolloutPercentage);
        const nextPercentage = currentStageIdx >= 0 && currentStageIdx < release.stages.length - 1
            ? release.stages[currentStageIdx + 1]
            : 100;

        try {
            await apiClient.post(API.RELEASE.EXPAND(release._id), { newPercentage: nextPercentage });
            fetchData();
        } catch (err: any) {
            alert(err.message || "Failed to promote rollout");
        }
    };

    const handlePause = async (releaseId: string) => {
        if (!window.confirm("Pause this rollout?")) return;
        try {
            await apiClient.post(API.RELEASE.STATUS(releaseId), { status: "PAUSED" });
            fetchData();
        } catch (err: any) {
            alert(err.message || "Failed to pause rollout");
        }
    };

    const handleRollback = async (releaseId: string) => {
        if (!window.confirm("CRITICAL: Are you sure you want to completely rollback this rollout?")) return;
        try {
            await apiClient.post(API.RELEASE.ROLLBACK(releaseId));
            fetchData();
        } catch (err: any) {
            alert(err.message || "Failed to rollback rollout");
        }
    };

    const getRiskScore = (release: PolicyRelease) => {
        if (release.anomalyScore !== undefined) return release.anomalyScore;
        if (release.expansionHistory && release.expansionHistory.length > 0) {
            return release.expansionHistory[release.expansionHistory.length - 1].riskScoreSnapshot;
        }
        return 0; // Default
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ACTIVE": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            case "PAUSED": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "FAILED": return "text-red-400 bg-red-400/10 border-red-400/20";
            case "ROLLED_BACK": return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
            default: return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        }
    };

    return (
        <div className="p-8 text-white max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-zinc-100 flex items-center gap-2">
                        <span className="text-blue-500">⎈</span> CROSS-TENANT ROLLOUTS
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Global observation and control plane for active policy deployments.</p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Syncing..." : "Refresh State"}
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-900/40 border border-red-500/50 text-red-200 rounded">
                    {error}
                </div>
            )}

            {loading && releases.length === 0 ? (
                <div className="text-zinc-500 p-12 flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
                    <p>Aggregating cross-tenant telemetry...</p>
                </div>
            ) : releases.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
                    <h3 className="text-zinc-300 font-semibold text-lg">No Active Rollouts</h3>
                    <p className="text-zinc-500 text-sm mt-2">There are currently no active policy rollouts in the platform.</p>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 text-zinc-500 border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Tenant</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Policy / Version</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Progress</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Risk</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {releases.map(release => {
                                const risk = getRiskScore(release);
                                const riskColor = risk > 70 ? "text-red-400" : risk > 40 ? "text-yellow-400" : "text-emerald-400";

                                return (
                                    <tr key={release._id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{tenants[release.tenantId] || release.tenantId}</div>
                                            <div className="text-xs text-zinc-600 font-mono mt-0.5">{release.tenantId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-blue-300">{release.policyId}</div>
                                            <div className="text-xs text-zinc-500 mt-0.5">v{release.candidateVersionId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider border rounded ${getStatusColor(release.status)}`}>
                                                {release.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-full bg-zinc-800 rounded-full h-1.5 max-w-[100px]">
                                                    <div
                                                        className="bg-blue-500 h-1.5 rounded-full"
                                                        style={{ width: `${release.rolloutPercentage}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono font-medium">{release.rolloutPercentage}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`font-mono font-medium ${riskColor}`}>
                                                {risk.toFixed(1)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {release.status === "ACTIVE" && release.rolloutPercentage < 100 && (
                                                <button
                                                    onClick={() => handlePromote(release)}
                                                    className="px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 rounded transition-colors"
                                                >
                                                    Promote
                                                </button>
                                            )}
                                            {release.status === "ACTIVE" && (
                                                <button
                                                    onClick={() => handlePause(release._id)}
                                                    className="px-2 py-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 rounded transition-colors"
                                                >
                                                    Pause
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRollback(release._id)}
                                                className="px-2 py-1 text-xs font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded transition-colors"
                                            >
                                                Rollback
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
