import React, { useState } from "react";
import type { UnifiedSimulationResult } from "../types";
import { RiskCard } from "./RiskCard";
import { BlastRadiusCard } from "./BlastRadiusCard";
import { PermissionDiffTable } from "./PermissionDiffTable";
import { ExplanationTimeline } from "./ExplanationTimeline";
import { ChevronDown, ChevronUp, Activity } from "lucide-react";

interface SimulationResultPanelProps {
    result: UnifiedSimulationResult | null;
    onClear?: () => void;
}

export const SimulationResultPanel: React.FC<SimulationResultPanelProps> = ({ result, onClear }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (!result) return null;

    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 mt-6 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Header Panel */}
            <div
                className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer select-none hover:bg-gray-100/80 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-600 p-1.5 rounded shadow-sm">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">Simulation Results Analysis</h2>
                        <p className="text-sm font-mono text-gray-500 mt-0.5 opacity-80 uppercase tracking-widest">{result.simulationId}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {onClear && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onClear(); }}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-300 rounded px-2.5 py-1 transition-all"
                        >
                            Dismiss
                        </button>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </div>

            {/* Expandable Body content */}
            {isExpanded && (
                <div className="p-6 bg-gray-50/30">
                    {/* Top Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {result.risk ? (
                            <RiskCard risk={result.risk} />
                        ) : (
                            <div className="rounded-xl border border-dashed border-gray-300 p-5 flex items-center justify-center text-gray-400 italic text-sm">No risk analysis data provided.</div>
                        )}

                        {result.rbac?.summary ? (
                            <BlastRadiusCard summary={result.rbac.summary} />
                        ) : (
                            <div className="rounded-xl bg-white border border-dashed border-gray-300 p-5 flex items-center justify-center text-gray-400 italic text-sm">No RBAC blast radius data calculated.</div>
                        )}
                    </div>

                    {/* Diff Table section */}
                    {result.rbac?.diffs && (
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3 tracking-wide uppercase">Identified Access Modifications</h3>
                            <PermissionDiffTable diffs={result.rbac.diffs} />
                        </div>
                    )}

                    {/* Explanation Visualizer */}
                    {result.explanation && (
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <ExplanationTimeline explanation={result.explanation} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
