import React from "react";
import type { VersionChange } from "../types";

interface DiffViewerProps {
    changes: VersionChange[];
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ changes }) => {
    if (changes.length === 0) {
        return (
            <div className="p-8 text-center bg-zinc-900 border border-dashed border-zinc-800 rounded-lg">
                <p className="text-zinc-500 text-sm">No structural differences found between these versions.</p>
            </div>
        );
    }

    const formatValue = (val: unknown) => {
        if (val === undefined) return "undefined";
        return JSON.stringify(val, null, 2);
    };

    return (
        <div className="space-y-6">
            {changes.map((change, idx) => {
                const isAdded = change.before === undefined && change.after !== undefined;
                const isRemoved = change.before !== undefined && change.after === undefined;
                const isModified = change.before !== undefined && change.after !== undefined;

                return (
                    <div key={idx} className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden shadow-sm">
                        <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
                            <span className="font-mono text-sm font-bold text-zinc-100">{change.field}</span>
                            <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded
                ${isAdded ? 'bg-green-500/10 text-green-400' : isRemoved ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}
              ">
                                {isAdded ? "Added" : isRemoved ? "Removed" : "Modified"}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 divide-x divide-zinc-800">
                            {/* Before Column (Red/Neutral) */}
                            <div className={`p-4 overflow-x-auto ${isAdded ? 'bg-zinc-800/20' : isModified || isRemoved ? 'bg-red-500/5' : 'bg-zinc-900'}`}>
                                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-semibold">Base Version</div>
                                {isAdded ? (
                                    <span className="text-zinc-600 italic text-sm">Not present</span>
                                ) : (
                                    <pre className={`font-mono text-sm ${isModified || isRemoved ? 'text-red-400' : 'text-zinc-300'}`}>
                                        {formatValue(change.before)}
                                    </pre>
                                )}
                            </div>

                            {/* After Column (Green/Neutral) */}
                            <div className={`p-4 overflow-x-auto ${isRemoved ? 'bg-zinc-800/20' : isModified || isAdded ? 'bg-green-500/5' : 'bg-zinc-900'}`}>
                                <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-semibold">Comparison Version</div>
                                {isRemoved ? (
                                    <span className="text-zinc-600 italic text-sm">Removed</span>
                                ) : (
                                    <pre className={`font-mono text-sm ${isModified || isAdded ? 'text-green-400' : 'text-zinc-300'}`}>
                                        {formatValue(change.after)}
                                    </pre>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
