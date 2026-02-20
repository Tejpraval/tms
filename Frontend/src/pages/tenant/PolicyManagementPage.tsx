import React, { useState, useEffect } from "react";
import { usePolicies, usePolicyVersions, useCreateDraft } from "../../modules/policy-management/hooks";
import { VersionTable } from "../../modules/policy-management/components/VersionTable";
import { SimulationResultPanel } from "../../modules/simulation/components/SimulationResultPanel";
import type { UnifiedSimulationResult } from "../../modules/simulation/types";

export const PolicyManagementPage: React.FC = () => {
    const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
    const [simulationResult, setSimulationResult] = useState<UnifiedSimulationResult | null>(null);
    const { data: policiesResponse, isLoading: policiesLoading } = usePolicies();
    const { data: versions, isLoading: versionsLoading } = usePolicyVersions(selectedPolicyId || "");
    const createDraftMutation = useCreateDraft();

    const policies = policiesResponse?.data || [];
    const activePolicy = policies.find((p: any) => p._id === selectedPolicyId);

    // Clear simulation on policy switch
    useEffect(() => {
        setSimulationResult(null);
    }, [selectedPolicyId]);

    const handleCreateDraft = () => {
        if (selectedPolicyId) {
            createDraftMutation.mutate({
                policyId: selectedPolicyId,
                rules: activePolicy?.tags || {}, // Dummy inject rules
            });
        }
    };

    const handleSimulationComplete = (result: UnifiedSimulationResult) => {
        setSimulationResult(result);
    };

    if (policiesLoading) return <div className="p-8 animate-pulse bg-gray-50 h-full">Loading Engine...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Policy Management</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Enterprise Governance Control Plane & Lifecycle Engine
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Policy Selection Sidebar */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
                    <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Active Policies</h3>
                    <div className="flex flex-col gap-2">
                        {policies.map((policy: any) => (
                            <button
                                key={policy._id}
                                onClick={() => setSelectedPolicyId(policy._id)}
                                className={`text-left px-4 py-3 rounded-md border text-sm transition-colors ${selectedPolicyId === policy._id
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-medium"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                            >
                                <div className="font-medium">{policy.name}</div>
                                <div className="text-xs text-gray-500 mt-0.5 font-mono">{policy.policyId}</div>
                            </button>
                        ))}
                        {policies.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-md">
                                No policies found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Version Table Main Area */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9">
                    {selectedPolicyId ? (
                        <div className="flex flex-col space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">{activePolicy?.name}</h2>
                                        <p className="text-xs text-gray-500 font-mono mt-1">ID: {activePolicy?.policyId}</p>
                                    </div>
                                    <button
                                        onClick={handleCreateDraft}
                                        disabled={createDraftMutation.isPending}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                                    >
                                        {createDraftMutation.isPending ? "Creating..." : "Create New Draft"}
                                    </button>
                                </div>
                                <div className="p-6">
                                    {versionsLoading ? (
                                        <div className="text-sm text-gray-500 animate-pulse">Loading versions...</div>
                                    ) : (
                                        <VersionTable
                                            policyId={selectedPolicyId}
                                            versions={versions || []}
                                            onSimulationSuccess={handleSimulationComplete}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Integrated Simulation Result Display */}
                            {simulationResult && (
                                <div className="transition-all mt-4">
                                    <SimulationResultPanel
                                        result={simulationResult}
                                        onClear={() => setSimulationResult(null)}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex items-center justify-center bg-gray-50 border border-gray-200 border-dashed rounded-lg">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-semibold text-gray-900">Select a Policy</h3>
                                <p className="mt-1 text-sm text-gray-500">Pick a policy from the sidebar to view and manage its version history.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
