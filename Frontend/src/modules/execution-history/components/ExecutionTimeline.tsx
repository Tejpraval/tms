import React from "react";
import { useExecutionHistory } from "../hooks";
import { ExecutionCard } from "./ExecutionCard";

interface ExecutionTimelineProps {
    policyId: string | undefined;
}

export const ExecutionTimeline: React.FC<ExecutionTimelineProps> = ({ policyId }) => {
    const { data: history, isLoading, error } = useExecutionHistory(policyId);

    if (!policyId) {
        return null; // Silent skip if no policy selected
    }

    if (isLoading) {
        return (
            <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-800 p-6 animate-pulse">
                <div className="h-6 w-1/3 bg-zinc-800 rounded mb-6"></div>
                <div className="space-y-4">
                    <div className="h-20 bg-zinc-800/50 rounded-lg"></div>
                    <div className="h-20 bg-zinc-800/50 rounded-lg"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-zinc-900 rounded-lg border border-red-500/20 p-6">
                <p className="text-sm text-red-400">Failed to load execution timeline.</p>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                <h3 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase mb-4">Execution History</h3>
                <div className="text-center py-8 border border-dashed border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-500">No executions have occurred for this policy yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-900 rounded-lg shadow-sm border border-zinc-800 p-6">
            <h3 className="text-sm font-semibold text-zinc-100 tracking-wide uppercase mb-6 flex items-center gap-2">
                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Execution Timeline
            </h3>

            <div className="relative">
                {history.map((record, idx) => (
                    <ExecutionCard
                        key={`${record.versionId}-${record.executedAt}`}
                        record={record}
                        isLast={idx === history.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};
