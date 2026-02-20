import React from "react";
import type { RbacDiffSummary } from "../types";
import { Users2, ShieldAlert } from "lucide-react";

interface BlastRadiusCardProps {
    summary: RbacDiffSummary;
}

export const BlastRadiusCard: React.FC<BlastRadiusCardProps> = ({ summary }) => {
    const { impactedUsers, blastRadius } = summary;

    const severityColor = {
        LOW: "text-green-600 bg-green-50 ring-green-500/20",
        MEDIUM: "text-yellow-600 bg-yellow-50 ring-yellow-500/20",
        HIGH: "text-orange-600 bg-orange-50 ring-orange-500/20",
        CRITICAL: "text-red-600 bg-red-50 ring-red-500/20",
    }[blastRadius] || "text-gray-600 bg-gray-50 ring-gray-500/20";

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Users2 className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Blast Radius</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm font-medium text-gray-500 mb-1">Impacted Users</p>
                    <p className="text-3xl font-black text-gray-900">{impactedUsers}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col justify-center items-start">
                    <p className="text-sm font-medium text-gray-500 mb-2">Severity Level</p>
                    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-bold ring-1 ring-inset ${severityColor}`}>
                        {blastRadius === "HIGH" || blastRadius === "CRITICAL" ? <ShieldAlert className="h-4 w-4" /> : null}
                        {blastRadius}
                    </span>
                </div>
            </div>
        </div>
    );
};
