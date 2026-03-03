import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { TenantContextIndicator } from "@/components/ui/TenantContextIndicator";
import { TenantOverviewGrid } from "@/modules/super-admin-dashboard/components/TenantOverviewGrid";
import { SkeletonTable } from "@/components/ui/Skeleton";

export default function PlatformOverviewPage() {
    const { data, isLoading } = useQuery({
        queryKey: ["platform-overview"],
        queryFn: async () => {
            const res = await apiClient.get("/platform/overview");
            return res.data;
        },
        refetchInterval: 30000,
    });

    if (isLoading) {
        return (
            <div className="p-6">
                <SkeletonTable rows={3} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Ecosystem Architecture</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Global oversight of cross-tenant policy execution, tenant metrics, and platform stability.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                <TenantOverviewGrid />
            </div>

            {/* Placeholder for future system audits or logs */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mt-8">
                <div className="p-4 border-b border-zinc-800 bg-zinc-950/50">
                    <h3 className="font-semibold text-zinc-300">Platform System Logs</h3>
                </div>
                <div className="p-12 text-center text-zinc-500 text-sm">
                    No critical ecosystem alerts generated in the last 24 hours.
                </div>
            </div>
        </div>
    );
}
