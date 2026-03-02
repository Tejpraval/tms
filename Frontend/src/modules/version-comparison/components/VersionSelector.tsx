import React from "react";
import type { PolicyVersion } from "../../policy-management/types";

interface VersionSelectorProps {
    versions: PolicyVersion[];
    baseVersion: number | null;
    compareVersion: number | null;
    onBaseChange: (v: number) => void;
    onCompareChange: (v: number) => void;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
    versions,
    baseVersion,
    compareVersion,
    onBaseChange,
    onCompareChange
}) => {
    return (
        <div className="flex items-center space-x-6 bg-zinc-900 p-4 rounded-lg border border-zinc-800 shadow-sm">
            <div className="flex flex-col">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Base Version</label>
                <select
                    value={baseVersion || ""}
                    onChange={(e) => onBaseChange(Number(e.target.value))}
                    className="block w-48 rounded-md bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="" disabled>Select Version</option>
                    {versions.map(v => (
                        <option key={v.version} value={v.version}>v{v.version} ({v.status})</option>
                    ))}
                </select>
            </div>

            <div className="flex items-center pt-5 px-2">
                <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </div>

            <div className="flex flex-col">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Compare Against</label>
                <select
                    value={compareVersion || ""}
                    onChange={(e) => onCompareChange(Number(e.target.value))}
                    className="block w-48 rounded-md bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    <option value="" disabled>Select Version</option>
                    {versions.map(v => (
                        <option key={v.version} value={v.version}>v{v.version} ({v.status})</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
