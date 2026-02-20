import { useState, useEffect } from "react";
import { apiClient } from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface TenantUser {
    _id: string;
    email: string;
    role: string;
    customRoleId?: { _id: string, name: string };
    createdAt: string;
}

interface RoleType {
    _id: string;
    name: string;
}

export default function TenantUsersPage() {
    const { role: currentUserRole } = useAuth();
    const [users, setUsers] = useState<TenantUser[]>([]);
    const [customRoles, setCustomRoles] = useState<RoleType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState("MANAGER");

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersRes, rolesRes] = await Promise.all([
                apiClient.get('/users'),
                apiClient.get('/roles').catch(() => ({ data: { data: [] } }))
            ]);
            setUsers(usersRes.data.data || []);
            setCustomRoles(rolesRes.data.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isCustom = customRoles.some(r => r._id === newRole);
            const payload = isCustom
                ? { email: newEmail, password: newPassword, customRoleId: newRole }
                : { email: newEmail, password: newPassword, role: newRole };

            await apiClient.post('/users', payload);
            setIsCreateModalOpen(false);
            setNewEmail("");
            setNewPassword("");
            setNewRole("MANAGER");
            fetchUsers();
        } catch (err: any) {
            console.error(err.response?.data || err);
            alert(err.response?.data?.message || err.message || "Failed to create user.");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await apiClient.delete(`/users/${userId}`);
            fetchUsers();
        } catch (err: any) {
            console.error(err.response?.data || err);
            alert(err.response?.data?.message || err.message || "Failed to delete user.");
        }
    };

    const handleUpdateRole = async (userId: string, targetRole: string) => {
        try {
            const isCustom = customRoles.some(r => r._id === targetRole);
            const payload = isCustom ? { customRoleId: targetRole } : { role: targetRole };

            await apiClient.patch(`/users/${userId}/role`, payload);
            fetchUsers();
        } catch (err: any) {
            console.error(err.response?.data || err);
            alert(err.response?.data?.message || err.message || "Failed to update role.");
        }
    };

    return (
        <div className="p-8 text-white max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-emerald-400">Tenant Workspace Access</h1>
                    <p className="text-zinc-400 text-sm mt-1">Isolate and delegate access correctly within your environment.</p>
                </div>
                {currentUserRole === 'TENANT_ADMIN' && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        + Access Grant
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-900/40 border border-red-500/50 text-red-200 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-zinc-500 p-12 flex justify-center">Loading context directory...</div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-wider text-xs border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Assigned Role</th>
                                <th className="px-6 py-4 font-semibold">Created</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-200">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.customRoleId?._id || user.role}
                                            onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                            className="bg-black border border-zinc-700 rounded px-2 py-1 text-xs text-blue-400 focus:outline-none focus:border-blue-500"
                                        >
                                            <optgroup label="Static Roles">
                                                <option value="TENANT_ADMIN">Tenant Admin</option>
                                                <option value="MANAGER">Manager</option>
                                                <option value="TENANT">Tenant Member</option>
                                            </optgroup>
                                            {customRoles.length > 0 && (
                                                <optgroup label="Dynamic Roles">
                                                    {customRoles.map(cr => (
                                                        <option key={cr._id} value={cr._id}>{cr.name}</option>
                                                    ))}
                                                </optgroup>
                                            )}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="text-xs bg-red-900/20 text-red-500 hover:bg-red-900/40 px-3 py-1.5 rounded transition-colors"
                                        >
                                            Revoke Context
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Grant Environment Access</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Collaborator Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Initial Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Execution Authority Bounds</label>
                                <select
                                    value={newRole}
                                    onChange={e => setNewRole(e.target.value)}
                                    className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-emerald-400 focus:border-emerald-500 focus:outline-none"
                                >
                                    <optgroup label="Static Roles (Native)">
                                        <option value="TENANT_ADMIN">Tenant Administrator (Full Capabilities)</option>
                                        <option value="MANAGER">Operational Manager (Deployments & Config)</option>
                                        <option value="TENANT">Standard Operator (Read Only Execution View)</option>
                                    </optgroup>
                                    {customRoles.length > 0 && (
                                        <optgroup label="Dynamic Boundaries (Custom)">
                                            {customRoles.map(cr => (
                                                <option key={cr._id} value={cr._id}>{cr.name}</option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
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
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Generate Access Token
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
