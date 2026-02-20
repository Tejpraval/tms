import { usePolicies } from "@/modules/policy-versioning/hooks";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function TenantPoliciesPage() {
    const { data: policies, isLoading } = usePolicies();
    const { role, permissions } = useAuth();
    const navigate = useNavigate();

    const hasPermission = (perm: string) => role === 'SUPER_ADMIN' || (permissions && permissions.includes(perm));

    if (isLoading) {
        return (
            <div className="p-8 text-white flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                <span className="ml-3 text-emerald-500 font-mono">Loading Tenant Policies...</span>
            </div>
        );
    }

    if (!policies || policies.length === 0) {
        return (
            <div className="p-8 text-white max-w-7xl mx-auto">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold font-mono text-blue-400 mb-1">Policy Governance</h1>
                        <p className="text-zinc-400 text-sm">Manage rules and distribution strategies for your tenant.</p>
                    </div>
                    {hasPermission('POLICY_WRITE') && (
                        <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
                            + Create Policy
                        </button>
                    )}
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center text-zinc-500">
                    No policies found in this tenant workspace.
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 text-white max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-blue-400 mb-1">Policy Governance</h1>
                    <p className="text-zinc-400 text-sm">Manage rules, simulate outcomes, and request approvals.</p>
                </div>
                {hasPermission('POLICY_WRITE') && (
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-lg shadow-emerald-500/10">
                        + Create Policy
                    </button>
                )}
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-950 text-zinc-400 uppercase text-xs border-b border-zinc-800">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold">Policy Name / ID</th>
                            <th className="text-left px-6 py-4 font-semibold">Active Version</th>
                            <th className="text-left px-6 py-4 font-semibold">Latest Draft</th>
                            <th className="text-right px-6 py-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {policies.map((policy) => (
                            <tr key={policy._id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-zinc-200">{policy.name}</div>
                                    <div className="text-xs font-mono text-zinc-500 mt-0.5">{policy.policyId}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono text-xs">
                                        v{policy.activeVersion ?? 'None'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-2 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded font-mono text-xs">
                                        v{policy.latestVersion}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate(`/policies/${policy._id}`); }}
                                        className="text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded transition-colors"
                                    >
                                        Manage & Simulate
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-xs text-zinc-500 flex gap-2 items-center">
                <span className="text-blue-500">ℹ</span>
                Click "Manage & Simulate" to access Version History, simulation telemetry, and approval submissions for each specific policy.
            </div>
        </div>
    );
}
