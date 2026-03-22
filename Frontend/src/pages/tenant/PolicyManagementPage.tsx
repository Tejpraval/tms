import React, { useState, useEffect } from "react";
import { usePolicies, usePolicyVersions, useCreateDraft } from "../../modules/policy-management/hooks";
import { VersionTable } from "../../modules/policy-management/components/VersionTable";
import { SimulationResultPanel } from "../../modules/simulation/components/SimulationResultPanel";
import type { UnifiedSimulationResult } from "../../modules/simulation/types";
import { ExecutionTimeline } from "../../modules/execution-history";
import { CreateDraftModal } from "../../modules/policy-versioning/components/CreateDraftModal";

export const PolicyManagementPage: React.FC = () => {
    const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
    const [simulationResult, setSimulationResult] = useState<UnifiedSimulationResult | null>(null);
    const { data: policiesResponse, isLoading: policiesLoading } = usePolicies();
    const { data: versions, isLoading: versionsLoading } = usePolicyVersions(selectedPolicyId || "");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const policies = policiesResponse?.data || [];
    const activePolicy = policies.find((p: any) => p._id === selectedPolicyId);

    // Clear simulation on policy switch
    useEffect(() => {
        setSimulationResult(null);
    }, [selectedPolicyId]);

    const handleCreateDraft = () => {
        if (selectedPolicyId) {
            setIsCreateModalOpen(true);
        }
    };

    const handleSimulationComplete = (result: UnifiedSimulationResult) => {
        setSimulationResult(result);
    };

    if (policiesLoading) return <div className="p-8 animate-pulse text-zinc-400 h-full">Loading Engine...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Policy Management</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Enterprise Governance Control Plane & Lifecycle Engine
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Policy Selection Sidebar */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 space-y-4">
                    <h3 className="text-sm font-semibold text-zinc-300 tracking-wide uppercase">Active Policies</h3>
                    <div className="flex flex-col gap-2">
                        {policies.map((policy: any) => (
                            <button
                                key={policy._id}
                                onClick={() => setSelectedPolicyId(policy._id)}
                                className={`text-left px-4 py-3 rounded-md border text-sm transition-colors ${selectedPolicyId === policy._id
                                    ? "bg-zinc-800 border-zinc-700 text-indigo-400 font-medium"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40 transition-colors/80 hover:border-zinc-700"
                                    }`}
                            >
                                <div className="font-medium">{policy.name}</div>
                                <div className="text-xs text-zinc-500 mt-0.5 font-mono">{policy.policyId}</div>
                            </button>
                        ))}
                        {policies.length === 0 && (
                            <div className="text-sm text-zinc-500 text-center py-4 border border-dashed border-zinc-800 rounded-md">
                                No policies found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Version Table Main Area */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9">
                    {selectedPolicyId ? (
                        <div className="flex flex-col space-y-6">
                            <div className="bg-zinc-900 rounded-xl shadow-sm border border-zinc-800 overflow-hidden">
                                <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-800/30 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-lg font-semibold text-zinc-100">{activePolicy?.name}</h2>
                                        <p className="text-xs text-zinc-500 font-mono mt-1">ID: {activePolicy?.policyId}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => window.location.href = `/policies/${selectedPolicyId}/compare`}
                                            className="inline-flex items-center px-4 py-2 border border-zinc-700 text-sm font-medium rounded-md shadow-sm text-zinc-300 bg-zinc-800 hover:bg-zinc-700 focus:outline-none transition-colors"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                            Compare Versions
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const candidate = versions?.find((v: any) => v.status === 'draft' || v.status === 'active');
                                                    if (!candidate) return alert("Must have at least one draft or active version to rollout.");

                                                    // Use apiClient to ensure the Authorization Header is sent
                                                    const { apiClient } = await import('../../lib/axios');
                                                    await apiClient.post('/policy-release', {
                                                        tenantId: activePolicy?.tenantId || 'demo-tenant',
                                                        policyId: activePolicy?._id,
                                                        baseVersionId: candidate._id,
                                                        candidateVersionId: candidate._id,
                                                        rolloutPercentage: 10
                                                    });

                                                    alert("✅ Quick Rollout Initiated! Go to the Rollouts page to view it.");
                                                } catch (err: any) {
                                                    console.error(err);
                                                    alert(`Failed to start rollout: ${err.response?.data?.message || err.message}`);
                                                }
                                            }}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none transition-colors"
                                        >
                                            Deploy Rollout
                                        </button>
                                        <button
                                            onClick={handleCreateDraft}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 transition-colors"
                                        >
                                            Create New Draft
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {versionsLoading ? (
                                        <div className="text-sm text-zinc-500 animate-pulse">Loading versions...</div>
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

                            {/* Execution Timeline */}
                            <div className="mt-8">
                                <ExecutionTimeline policyId={selectedPolicyId} />
                            </div>

                            {/* Draft Modal */}
                            <CreateDraftModal 
                                isOpen={isCreateModalOpen} 
                                onClose={() => setIsCreateModalOpen(false)} 
                                policyId={selectedPolicyId} 
                            />
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex items-center justify-center bg-zinc-900 border border-zinc-800 border-dashed rounded-xl">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-semibold text-zinc-300">Select a Policy</h3>
                                <p className="mt-1 text-sm text-zinc-500">Pick a policy from the sidebar to view and manage its version history.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
