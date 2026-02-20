import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

// Logical groupings for UI rendering
const PERMISSION_GROUPS = {
    "Policies & Rules": ["POLICY_READ", "POLICY_WRITE", "POLICY_APPROVE", "POLICY_ADMIN"],
    "Tenant & Users": ["TENANT_READ", "TENANT_CREATE", "TENANT_UPDATE", "TENANT_DELETE", "USER_MANAGE"],
    "Platform Operations": ["PROPERTY_READ", "PROPERTY_MANAGE", "PAYMENT_READ", "PAYMENT_COLLECT"]
};

interface RoleType {
    _id: string;
    name: string;
    permissions: string[];
    createdAt: string;
}

export default function TenantRolesPage() {
    const { role: currentUserRole } = useAuth();
    const [roles, setRoles] = useState<RoleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleType | null>(null);

    const [newRoleName, setNewRoleName] = useState("");
    const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

    const fetchRoles = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get('/roles');
            setRoles(data.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to load roles.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const togglePermission = (perm: string) => {
        setNewRolePermissions(prev =>
            prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
        );
    };

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.post('/roles', {
                name: newRoleName,
                permissions: newRolePermissions
            });
            setIsCreateModalOpen(false);
            setNewRoleName("");
            setNewRolePermissions([]);
            fetchRoles();
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || "Failed to create role.");
        }
    };

    const handleEditRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;
        try {
            await apiClient.patch(`/roles/${editingRole._id}/permissions`, {
                permissions: newRolePermissions
            });
            setIsEditModalOpen(false);
            setEditingRole(null);
            setNewRolePermissions([]);
            fetchRoles();
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || "Failed to update role permissions.");
        }
    };

    const openEditModal = (role: RoleType) => {
        setEditingRole(role);
        setNewRoleName(role.name); // Just for display (unchangeable backendly via patch)
        setNewRolePermissions(role.permissions);
        setIsEditModalOpen(true);
    };

    const handleDeleteRole = async (roleId: string) => {
        if (!confirm("Are you sure you want to delete this custom role? Users assigned to it will lose capability processing until reassigned.")) return;
        try {
            await apiClient.delete(`/roles/${roleId}`);
            fetchRoles();
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || "Failed to delete role.");
        }
    };

    return (
        <div className="p-8 text-white max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-cyan-400">Dynamic RBAC Profiles</h1>
                    <p className="text-zinc-400 text-sm mt-1">Configure extremely granular execution roles matching precise legal bounds.</p>
                </div>
                {currentUserRole === 'TENANT_ADMIN' && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        + Create Role
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-900/40 border border-red-500/50 text-red-200 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-zinc-500 p-12 flex justify-center">Loading security profiles...</div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-wider text-xs border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Role Bound Name</th>
                                <th className="px-6 py-4 font-semibold">Explicit Permissions Count</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {roles.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-zinc-600">
                                        No custom isolated roles assigned.
                                    </td>
                                </tr>
                            ) : null}
                            {roles.map(role => (
                                <tr key={role._id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-cyan-200">{role.name}</td>
                                    <td className="px-6 py-4 text-zinc-400">
                                        <div className="flex flex-wrap gap-2">
                                            {role.permissions.map(p => (
                                                <span key={p} className="bg-zinc-800 px-2 py-1 rounded text-xs border border-zinc-700">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => openEditModal(role)}
                                            className="text-xs bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 px-3 py-1.5 rounded transition-colors"
                                        >
                                            Edit Boundary
                                        </button>
                                        <button
                                            onClick={() => handleDeleteRole(role._id)}
                                            className="text-xs bg-red-900/20 text-red-500 hover:bg-red-900/40 px-3 py-1.5 rounded transition-colors"
                                        >
                                            Delete Boundary
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* CREATE MODAL */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg w-full max-w-2xl shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Establish Security Boundary</h2>
                        <form onSubmit={handleCreateRole} className="space-y-6">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Execution Role Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Compliance Officer"
                                    value={newRoleName}
                                    onChange={e => setNewRoleName(e.target.value)}
                                    className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm text-zinc-400 mb-1 border-b border-zinc-800 pb-2">Explicit RBAC Definitions</label>
                                {Object.entries(PERMISSION_GROUPS).map(([groupName, perms]) => (
                                    <div key={groupName} className="bg-black/50 p-4 rounded border border-zinc-800">
                                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{groupName}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {perms.map(perm => {
                                                const isChecked = newRolePermissions.includes(perm);
                                                return (
                                                    <label key={perm} className="flex items-center space-x-3 cursor-pointer group">
                                                        <input type="checkbox" className="hidden" checked={isChecked} onChange={() => togglePermission(perm)} />
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-cyan-600 border-cyan-500' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                                                            {isChecked && <div className="w-2 h-2 bg-white rounded-sm" />}
                                                        </div>
                                                        <span className={`text-sm ${isChecked ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                                            {perm}
                                                        </span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Construct Boundary
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {isEditModalOpen && editingRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg w-full max-w-2xl shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-2">Modify Boundary Definitions</h2>
                        <p className="text-zinc-400 text-sm mb-4">You are actively adjusting the capability boundaries for the role: <span className="font-semibold text-cyan-400 font-mono">{editingRole.name}</span>.</p>

                        <form onSubmit={handleEditRole} className="space-y-6">
                            <div className="space-y-4">
                                <label className="block text-sm text-zinc-400 mb-1 border-b border-zinc-800 pb-2">Explicit RBAC Definitions</label>
                                {Object.entries(PERMISSION_GROUPS).map(([groupName, perms]) => (
                                    <div key={groupName} className="bg-black/50 p-4 rounded border border-zinc-800">
                                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{groupName}</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {perms.map(perm => {
                                                const isChecked = newRolePermissions.includes(perm);
                                                return (
                                                    <label key={perm} className="flex items-center space-x-3 cursor-pointer group">
                                                        <input type="checkbox" className="hidden" checked={isChecked} onChange={() => togglePermission(perm)} />
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-cyan-600 border-cyan-500' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                                                            {isChecked && <div className="w-2 h-2 bg-white rounded-sm" />}
                                                        </div>
                                                        <span className={`text-sm ${isChecked ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                                                            {perm}
                                                        </span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => { setIsEditModalOpen(false); setEditingRole(null); }}
                                    className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
