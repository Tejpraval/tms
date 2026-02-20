import React, { useState } from "react";
import type { PolicyVersion } from "../types";
import type { UnifiedSimulationResult } from "../../simulation/types";
import { StatusBadge } from "./StatusBadge";
import { Play, CheckCircle, RotateCcw } from "lucide-react";
import {
    useSimulatePolicy,
    useApprovePolicy,
    useExecutePolicy,
    useRollbackPolicy,
} from "../hooks";

interface VersionTableProps {
    policyId: string;
    versions: PolicyVersion[];
    onSimulationSuccess?: (result: UnifiedSimulationResult) => void;
}

export const VersionTable: React.FC<VersionTableProps> = ({
    policyId,
    versions,
    onSimulationSuccess,
}) => {
    const [targetSimulationId] = useState(""); // Simplified state mocking for demo purposes
    const simulateMutation = useSimulatePolicy(policyId);
    const approveMutation = useApprovePolicy(policyId);
    const executeMutation = useExecutePolicy(policyId);
    const rollbackMutation = useRollbackPolicy(policyId);

    const handleSimulate = (version: number) => {
        simulateMutation.mutate({
            policyId,
            version,
            change: { action: "modify", resource: "Demo", attributes: {} },
        }, {
            onSuccess: (data: any) => {
                if (onSimulationSuccess) onSimulationSuccess(data);
            }
        });
    };

    const renderActions = (version: PolicyVersion) => {
        switch (version.status) {
            case "draft":
                return (
                    <button
                        onClick={() => handleSimulate(version.version)}
                        disabled={simulateMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none disabled:opacity-50"
                    >
                        <Play className="h-4 w-4 mr-1 text-indigo-500" />
                        Simulate
                    </button>
                );

            case "pending_approval":
                return (
                    <div className="flex flex-col gap-2">
                        <span className="text-xs text-yellow-600 font-medium">Awaiting Approval</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    approveMutation.mutate({ simulationId: targetSimulationId || "demo-sim-id" })
                                }
                                disabled={approveMutation.isPending}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                );

            case "approved":
                return (
                    <button
                        onClick={() => executeMutation.mutate(targetSimulationId || "demo-sim-id")}
                        disabled={executeMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 shadow-sm"
                    >
                        <CheckCircle className="h-4 w-4 mr-1 text-white" />
                        Execute
                    </button>
                );

            case "active":
                return (
                    <button
                        onClick={() => rollbackMutation.mutate(version.version)}
                        disabled={rollbackMutation.isPending}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none disabled:opacity-50"
                    >
                        <RotateCcw className="h-4 w-4 mr-1 text-red-500" />
                        Rollback
                    </button>
                );

            case "deprecated":
            case "rolled_back":
                return <span className="text-xs text-gray-400">Read Only</span>;

            default:
                return null;
        }
    };

    if (!versions || versions.length === 0) {
        return <div className="text-sm text-gray-500 p-4">No versions found.</div>
    }

    return (
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                            Version Let
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Status
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Last Updated
                        </th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {versions.map((version) => (
                        <tr key={version.version} className={version.status === 'active' ? 'bg-indigo-50/20' : ''}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                v{version.version}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <StatusBadge status={version.status} />
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(version.updatedAt || version.createdAt).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                {renderActions(version)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
