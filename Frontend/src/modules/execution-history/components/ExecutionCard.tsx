import React from "react";
import type { ExecutionRecord } from "../types";

interface ExecutionCardProps {
    record: ExecutionRecord;
    isLast: boolean;
}

export const ExecutionCard: React.FC<ExecutionCardProps> = ({ record, isLast }) => {
    const getRiskColor = (severity: string) => {
        switch (severity) {
            case "LOW": return "bg-green-500";
            case "MEDIUM": return "bg-yellow-500";
            case "HIGH": return "bg-orange-500";
            case "CRITICAL": return "bg-red-500";
            default: return "bg-zinc-500";
        }
    };

    return (
        <div className="relative pl-8 py-4 group">
            {/* Timeline Line */}
            {!isLast && (
                <div className="absolute top-8 left-[11px] bottom-[-16px] w-[2px] bg-zinc-800" />
            )}

            {/* Semantic Dot Placeholder */}
            <div className="absolute top-6 left-0 w-6 h-6 flex items-center justify-center">
                <div className={`w-3 h-3 rounded-full shadow-sm ring-4 ring-zinc-900 ${getRiskColor(record.riskSeverity)} transition-transform group-hover:scale-125`} />
            </div>

            {/* Card Content */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-sm hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-zinc-100 font-mono">v{record.versionId}</h4>
                            <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${getRiskColor(record.riskSeverity).replace('bg-', 'text-').concat(' bg-opacity-10 bg-current')}`}>
                                {record.riskSeverity} RISK
                            </span>
                        </div>
                        <p className="text-xs text-zinc-400">
                            Executed by <span className="text-zinc-300 font-medium">{record.executedBy}</span>
                        </p>
                    </div>
                    <div className="text-xs text-zinc-500 text-right">
                        {new Date(record.executedAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short"
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
