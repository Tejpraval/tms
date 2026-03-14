import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { SkeletonTable } from "@/components/ui/Skeleton";

interface GlobalAuditLog {
    _id: string;
    tenantId: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata: any;
    createdAt: string;
}

interface PaginatedAuditResponse {
    data: GlobalAuditLog[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function GlobalAuditPage() {
    const [page, setPage] = useState(1);
    const limit = 50;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["global-audit", page],
        queryFn: async () => {
            const res = await apiClient.get<PaginatedAuditResponse>(`/audit/global?page=${page}&limit=${limit}`);
            return res.data;
        },
        placeholderData: keepPreviousData,
        staleTime: 10000,
    });

    if (isLoading && !data) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <SkeletonTable rows={10} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl text-red-400">
                    Failed to fetch global audit telemetry. Check network or permissions.
                </div>
            </div>
        );
    }

    const logs = data?.data || [];
    const totalPages = data?.totalPages || 0;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-3">
                        Global Audit Telemetry
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest font-semibold">
                            Platform Scope
                        </span>
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Cross-tenant infrastructure observability and action tracking.</p>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm text-zinc-300">
                    <thead className="bg-zinc-950 text-zinc-500 border-b border-zinc-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Timestamp</th>
                            <th className="px-6 py-4 font-semibold">Tenant ID</th>
                            <th className="px-6 py-4 font-semibold">Actor (User ID)</th>
                            <th className="px-6 py-4 font-semibold">Action</th>
                            <th className="px-6 py-4 font-semibold">Entity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {logs.map((log: GlobalAuditLog) => (
                            <tr key={log._id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4 text-zinc-400 font-mono text-xs whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-indigo-300 font-mono text-xs">{log.tenantId}</td>
                                <td className="px-6 py-4 text-emerald-400 font-mono text-xs">{log.userId}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-zinc-800 px-2 py-1 rounded text-xs font-semibold text-zinc-300 inline-block">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-400">
                                    {log.entityType} <span className="text-zinc-500 font-mono text-xs ml-1">({log.entityId})</span>
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                                    No audit telemetry found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-4 py-2 border border-zinc-700 bg-zinc-800 rounded text-zinc-300 hover:bg-zinc-700 disabled:opacity-50 transition"
                    >
                        Previous
                    </button>
                    <span className="text-zinc-500 text-sm">
                        Page <span className="text-white font-medium">{page}</span> of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="px-4 py-2 border border-blue-600/50 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 disabled:opacity-50 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
