interface TenantRisk {
    id: string;
    name: string;
    stressScore: number;
    tier: "Critical" | "High" | "Medium" | "Low";
    activeRollouts: number;
    pendingApprovals: number;
    health: number;
}

const mockTenants: TenantRisk[] = [
    {
        id: "t1",
        name: "Acme Corp",
        stressScore: 88,
        tier: "Critical",
        activeRollouts: 12,
        pendingApprovals: 8,
        health: 92,
    },
    {
        id: "t2",
        name: "Globex Inc",
        stressScore: 45,
        tier: "Medium",
        activeRollouts: 3,
        pendingApprovals: 1,
        health: 99,
    },
    {
        id: "t3",
        name: "Soylent Corp",
        stressScore: 72,
        tier: "High",
        activeRollouts: 6,
        pendingApprovals: 4,
        health: 85,
    },
    {
        id: "t4",
        name: "Umbrella Corp",
        stressScore: 95,
        tier: "Critical",
        activeRollouts: 15,
        pendingApprovals: 12,
        health: 78,
    },
    {
        id: "t5",
        name: "Stark Ind",
        stressScore: 12,
        tier: "Low",
        activeRollouts: 2,
        pendingApprovals: 0,
        health: 100,
    },
];

export const TenantRiskMatrix = () => {
    const getTierBadge = (tier: string) => {
        switch (tier) {
            case "Critical":
                return "bg-red-500/10 text-red-400 border-red-500/20";
            case "High":
                return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            case "Medium":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "Low":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            default:
                return "bg-zinc-800 text-zinc-400 border-zinc-700";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-red-400";
        if (score >= 60) return "text-orange-400";
        if (score >= 40) return "text-yellow-400";
        return "text-emerald-400";
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Tenant Risk Matrix</h3>
                <button className="text-xs text-blue-400 hover:text-blue-300">
                    View All Tenants
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-950/50 text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                            <th className="px-6 py-3 font-medium">Tenant Name</th>
                            <th className="px-6 py-3 font-medium">Risk Tier</th>
                            <th className="px-6 py-3 font-medium">Stress Score</th>
                            <th className="px-6 py-3 font-medium">Active Rollouts</th>
                            <th className="px-6 py-3 font-medium">Approvals Queued</th>
                            <th className="px-6 py-3 font-medium text-right">30d Health</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {mockTenants.map((tenant) => (
                            <tr
                                key={tenant.id}
                                className="hover:bg-zinc-800/20 transition group cursor-pointer"
                            >
                                <td className="px-6 py-4 text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                    {tenant.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getTierBadge(
                                            tenant.tier
                                        )}`}
                                    >
                                        {tenant.tier}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-sm font-bold ${getScoreColor(
                                                tenant.stressScore
                                            )}`}
                                        >
                                            {tenant.stressScore}
                                        </span>
                                        <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${tenant.stressScore >= 80
                                                        ? "bg-red-500"
                                                        : tenant.stressScore >= 60
                                                            ? "bg-orange-500"
                                                            : tenant.stressScore >= 40
                                                                ? "bg-yellow-500"
                                                                : "bg-emerald-500"
                                                    }`}
                                                style={{ width: `${tenant.stressScore}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-zinc-300">
                                    {tenant.activeRollouts}
                                </td>
                                <td className="px-6 py-4 text-sm text-zinc-300">
                                    {tenant.pendingApprovals}
                                </td>
                                <td className="px-6 py-4 text-sm text-right font-mono text-zinc-400">
                                    {tenant.health}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
