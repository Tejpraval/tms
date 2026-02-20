import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";

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

export default function TenantRolloutsPage() {
    const [releases, setReleases] = useState<PolicyRelease[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: releaseData } = await apiClient.get(API.RELEASE.ACTIVE);
            const allReleases: PolicyRelease[] = releaseData.data || [];

            // Backend handles tenant isolation
            setReleases(allReleases);
        } catch (err: any) {
            setError(err.message || "Failed to load active rollouts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => { fetchData(); }, 15000);
        return () => clearInterval(interval);
    }, []);

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
            default: return "text-blue-400 bg-blue-400/10 border-blue-400/20";
        }
    };

    return (
        <div className="p-8 text-white max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-purple-400 flex items-center gap-2">
                        Rollout Intelligence
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Live tracking of active distributions hitting your tenant environment.</p>
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
                    <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <p>Loading isolated rollout metrics...</p>
                </div>
            ) : releases.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
                    <h3 className="text-zinc-300 font-semibold text-lg">No Active Policy Distributions</h3>
                    <p className="text-zinc-500 text-sm mt-2">All governance rules are currently in a steady operational state.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {releases.map(release => {
                        const risk = getRiskScore(release);
                        const riskColor = risk > 70 ? "text-red-400" : risk > 40 ? "text-yellow-400" : "text-emerald-400";
                        const stageIndex = release.stages.indexOf(release.rolloutPercentage);
                        const stageLabel = stageIndex >= 0 ? `Stage ${stageIndex + 1}` : "Custom";

                        return (
                            <div key={release._id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col relative overflow-hidden">
                                {release.status === 'ACTIVE' && (
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                                )}

                                <div className="flex justify-between items-start mb-4 mt-1">
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-300 font-mono">{release.policyId}</h3>
                                        <p className="text-xs text-zinc-500">Candidate: v{release.candidateVersionId}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 text-xs font-bold border rounded ${getStatusColor(release.status)}`}>
                                        {release.status}
                                    </span>
                                </div>

                                <div className="space-y-4 flex-1">
                                    <div>
                                        <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                            <span>Progress ({stageLabel})</span>
                                            <span className="font-mono text-zinc-300">{release.rolloutPercentage}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-800 rounded-full h-2">
                                            <div
                                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${release.rolloutPercentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between p-3 bg-black/50 border border-zinc-800 rounded-md">
                                        <span className="text-sm text-zinc-400">Target Risk Score</span>
                                        <span className={`font-mono font-bold ${riskColor}`}>{risk.toFixed(1)}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-600 mt-4 text-center">Managed by Platform Admin</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
