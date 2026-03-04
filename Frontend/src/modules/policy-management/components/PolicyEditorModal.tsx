import React, { useState } from "react";
import { X, ShieldAlert, Cpu, Play } from "lucide-react";

interface PolicyEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    policyId: string;
    version: number;
    onSubmit: (payload: any) => void;
    isLoading: boolean;
}

const AVAILABLE_PERMISSIONS = [
    { id: "TENANT_READ", label: "Read Tenant Info", risk: "LOW" },
    { id: "PAYMENT_READ", label: "Read Invoices & Payments", risk: "LOW" },
    { id: "TENANT_UPDATE", label: "Modify Tenant Settings", risk: "MEDIUM" },
    { id: "USER_MANAGE", label: "Manage User Accounts", risk: "HIGH" },
    { id: "PROPERTY_MANAGE", label: "Manage Physical Properties", risk: "HIGH" },
    { id: "TENANT_CREATE", label: "Provision New Tenants", risk: "CRITICAL" },
    { id: "TENANT_DELETE", label: "Delete Entire Tenant", risk: "CRITICAL" },
];

const AVAILABLE_ROLES = ["USER", "ADMIN", "SUPER_ADMIN", "GUEST", "AUDITOR"];

export const PolicyEditorModal: React.FC<PolicyEditorModalProps> = ({
    isOpen,
    onClose,
    policyId,
    version,
    onSubmit,
    isLoading
}) => {
    const [selectedRole, setSelectedRole] = useState("USER");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    // ABAC State
    const [abacAction, setAbacAction] = useState("TENANT_DELETE");
    const [abacFrom, setAbacFrom] = useState("DENY");
    const [abacTo, setAbacTo] = useState("ALLOW");
    const [enableAbac, setEnableAbac] = useState(false);

    if (!isOpen) return null;

    const handleTogglePermission = (permId: string) => {
        if (selectedPermissions.includes(permId)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permId));
        } else {
            setSelectedPermissions([...selectedPermissions, permId]);
        }
    };

    const handleSimulate = () => {
        const payload: any = {
            policyId,
            version,
            change: { action: "modify", resource: "Demo", attributes: {} }
        };

        if (selectedPermissions.length > 0) {
            payload.rbacChange = {
                type: "ROLE_PERMISSION_UPDATE",
                roleId: selectedRole,
                permissions: selectedPermissions
            };
        }

        if (enableAbac) {
            payload.abacChange = [
                { action: abacAction, from: abacFrom, to: abacTo }
            ];
        }

        onSubmit(payload);
    };

    const countCritical = selectedPermissions.filter(p =>
        AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.risk === "CRITICAL" ||
        AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.risk === "HIGH"
    ).length;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 m-4 md:m-0 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 border-b border-zinc-800 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-indigo-400" />
                            Interactive Policy Builder
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                            Configure the exact RBAC/ABAC changes you want to simulate and execute.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors bg-zinc-800/50 p-2 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* RBAC CONFIGURATION */}
                    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 space-y-4">
                        <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-2">1. RBAC Assignment</h4>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Target Role</label>
                            <select
                                value={selectedRole}
                                onChange={e => setSelectedRole(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {AVAILABLE_ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-2">Permissions to Grant</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {AVAILABLE_PERMISSIONS.map(perm => (
                                    <label
                                        key={perm.id}
                                        className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${selectedPermissions.includes(perm.id)
                                            ? perm.risk === "CRITICAL" || perm.risk === "HIGH"
                                                ? "bg-red-500/10 border-red-500/50 text-red-200"
                                                : "bg-indigo-500/10 border-indigo-500/50 text-indigo-200"
                                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                            }`}
                                    >
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-zinc-900"
                                                checked={selectedPermissions.includes(perm.id)}
                                                onChange={() => handleTogglePermission(perm.id)}
                                            />
                                        </div>
                                        <div className="ml-3 text-sm flex flex-col">
                                            <span className="font-medium">{perm.label}</span>
                                            <span className="text-[10px] uppercase font-mono mt-0.5 tracking-wider opacity-70">
                                                {perm.id} • {perm.risk}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ABAC CONFIGURATION */}
                    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl p-5 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">2. ABAC Overrides</h4>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={enableAbac} onChange={() => setEnableAbac(!enableAbac)} />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${enableAbac ? 'bg-indigo-500' : 'bg-zinc-700'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enableAbac ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                            </label>
                        </div>

                        {enableAbac && (
                            <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1">Action</label>
                                    <select
                                        value={abacAction}
                                        onChange={e => setAbacAction(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-zinc-200"
                                    >
                                        <option value="TENANT_DELETE">TENANT_DELETE</option>
                                        <option value="TENANT_UPDATE">TENANT_UPDATE</option>
                                        <option value="TENANT_CREATE">TENANT_CREATE</option>
                                        <option value="USER_MANAGE">USER_MANAGE</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1">Change From</label>
                                    <select
                                        value={abacFrom}
                                        onChange={e => setAbacFrom(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-zinc-200"
                                    >
                                        <option value="DENY">DENY</option>
                                        <option value="ALLOW">ALLOW</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-zinc-500 mb-1">Change To</label>
                                    <select
                                        value={abacTo}
                                        onChange={e => setAbacTo(e.target.value)}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-zinc-200"
                                    >
                                        <option value="ALLOW">ALLOW</option>
                                        <option value="DENY">DENY</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-between items-center border-t border-zinc-800 pt-5">
                    {countCritical > 0 || enableAbac ? (
                        <div className="flex items-center text-red-400 bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            <span className="text-xs font-medium tracking-wide uppercase">High Risk Configuration</span>
                        </div>
                    ) : (
                        <div className="text-zinc-500 text-xs">Standard Configuration</div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSimulate}
                            disabled={isLoading || (!enableAbac && selectedPermissions.length === 0)}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-transparent rounded-lg transition-colors disabled:opacity-50 inline-flex items-center"
                        >
                            {isLoading ? "Simulating..." : "Run Sandbox Simulation"}
                            <Play className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
