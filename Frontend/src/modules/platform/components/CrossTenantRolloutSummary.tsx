export const CrossTenantRolloutSummary = () => {
    // Mock Data
    const stats = [
        {
            label: "Active Rollouts",
            value: "24",
            subtext: "Across 12 tenants",
            color: "text-blue-400",
            trend: "+4 this week",
        },
        {
            label: "High Risk",
            value: "3",
            subtext: "Requires attention",
            color: "text-red-400",
            trend: "Stable",
        },
        {
            label: "Pending Approvals",
            value: "18",
            subtext: "Bottleneck detected",
            color: "text-amber-400",
            trend: "-2 from yesterday",
        },
        {
            label: "System Health",
            value: "99.8%",
            subtext: "Operational",
            color: "text-emerald-400",
            trend: "All systems go",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-700 transition"
                >
                    <div>
                        <span className="text-zinc-500 text-sm font-medium uppercase tracking-wider">
                            {stat.label}
                        </span>
                        <div className={`text-3xl font-bold mt-2 ${stat.color}`}>
                            {stat.value}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-zinc-400">{stat.subtext}</span>
                        <span className="text-zinc-500">{stat.trend}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
