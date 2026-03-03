import { useQuery } from "@tanstack/react-query";
import { getGovernanceOverview } from "../api";
import { TenantMetricsTable } from "./TenantMetricsTable";
import { SkeletonTable } from "@/components/ui/Skeleton";

export function TenantOverviewGrid() {
    const { data: overviewData, isLoading, isError, dataUpdatedAt } = useQuery({
        queryKey: ["super-admin", "governance-overview"],
        queryFn: getGovernanceOverview,
        retry: 1, // Minimize retry storms on platform layer
        staleTime: 60000
    });

    if (isLoading) {
        return (
            <div className="mt-6">
                <SkeletonTable rows={4} />
            </div>
        );
    }

    if (isError || !overviewData) {
        return (
            <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl text-red-400 text-sm">
                Failed to load cross-tenant governance data. Check platform connection.
            </div>
        );
    }

    // High level rolled-up KPIs
    const totalEcosystemPolicies = overviewData.reduce((acc, t) => acc + t.totalPolicies, 0);
    const totalEcosystemRisks = overviewData.reduce((acc, t) => acc + t.highRiskApprovals, 0);
    const activeTenants = overviewData.length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center text-zinc-500 text-xs px-1">
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Platform Telemetry Live
                </span>
                {dataUpdatedAt > 0 && <span>Last sync {Math.round((Date.now() - dataUpdatedAt) / 1000)}s ago</span>}
            </div>

            {/* Super Admin Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Active Tenants</p>
                    <span className="text-3xl font-mono text-indigo-400">{activeTenants}</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Ecosystem Policies</p>
                    <span className="text-3xl font-mono text-zinc-300">{totalEcosystemPolicies}</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Ecosystem Critical Risks</p>
                    <span className={`text-3xl font-mono ${totalEcosystemRisks > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {totalEcosystemRisks}
                    </span>
                </div>
            </div>

            {/* The primary sorting data grid */}
            <TenantMetricsTable data={overviewData} />
        </div>
    );
};
