import React, { useState } from "react";
import type { TenantOverviewRecord } from "../types";

interface TenantMetricsTableProps {
    data: TenantOverviewRecord[];
}

export const TenantMetricsTable: React.FC<TenantMetricsTableProps> = ({ data }) => {
    const [search, setSearch] = useState("");

    // Sort logic (default high risk first)
    const sortedData = [...data].sort((a, b) => b.highRiskApprovals - a.highRiskApprovals);

    // Filter
    const filteredData = sortedData.filter(t =>
        (t.tenantName || "").toLowerCase().includes(search.toLowerCase()) ||
        (t.tenantId || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
                <h3 className="font-semibold text-zinc-300">Tenant Governance Metrics</h3>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search tenants..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-md py-1.5 pl-8 pr-3 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <svg className="w-4 h-4 text-zinc-500 absolute left-2.5 top-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-900/50 text-zinc-500 uppercase font-semibold text-xs border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-4">Tenant</th>
                            <th className="px-6 py-4 text-right">Total Policies</th>
                            <th className="px-6 py-4 text-right">Pending Approvals</th>
                            <th className="px-6 py-4 text-right">High Risk Anomalies</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                    No tenants match your search filter.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((tenant) => (
                                <tr key={tenant.tenantId} className="hover:bg-zinc-800/40 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-zinc-200">{tenant.tenantName}</div>
                                        <div className="text-xs text-zinc-500 font-mono mt-0.5">{tenant.tenantId}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-mono text-zinc-300">{tenant.totalPolicies}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`font-mono px-2 py-0.5 rounded text-xs ${tenant.pendingApprovals > 0 ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-500'}`}>
                                            {tenant.pendingApprovals}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`font-mono px-2 py-0.5 rounded text-xs ${tenant.highRiskApprovals > 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                            {tenant.highRiskApprovals} {tenant.highRiskApprovals > 0 && "CRITICAL"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
