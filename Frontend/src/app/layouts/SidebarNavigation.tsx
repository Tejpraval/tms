import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const SidebarNavigation = () => {
    const { role, permissions } = useAuth();

    // Explicit permission validator with SUPER_ADMIN safe bypass override natively
    const hasPermission = (perm: string) => role === 'SUPER_ADMIN' || (permissions && permissions.includes(perm));

    // Dynamic Navigation Generation utilizing native custom capabilities.
    const navLinks = [
        ...(hasPermission("TENANT_READ") ? [{ label: "Dashboard", href: role === "SUPER_ADMIN" ? "/platform-overview" : "/dashboard" }] : []),
        ...(role === "SUPER_ADMIN" ? [{ label: "Tenant Registry", href: "/tenant-registry" }] : []),
        ...(role === "SUPER_ADMIN" ? [{ label: "Cross-Tenant Rollouts", href: "/cross-tenant-rollouts" }] : []),
        ...(hasPermission("POLICY_ADMIN") ? [{ label: "Live Rollouts", href: "/rollouts" }] : []),
        ...(hasPermission("POLICY_READ") ? [{ label: "Policy Versioning", href: "/policies" }] : []),
        ...(hasPermission("POLICY_APPROVE") ? [{ label: "Approval Console", href: "/approvals" }] : []),
        ...(hasPermission("POLICY_READ") ? [{ label: "Evaluation History", href: "/evaluations" }] : []),
        ...(hasPermission("USER_MANAGE") ? [
            { label: "Role Boundaries", href: "/roles" },
            { label: "User Accounts", href: "/users" }
        ] : []),
        ...((hasPermission("TENANT_READ") || role === "SUPER_ADMIN") ? [{ label: "Audit Logs", href: role === "SUPER_ADMIN" ? "/system-audit" : "/tenant-audit" }] : []),
    ];

    return (
        <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Resumeproject
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="px-3 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    {role === "SUPER_ADMIN" ? "Platform Admin" : "Tenant Workspace"}
                </div>
                {navLinks.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${isActive
                                ? "bg-zinc-900 text-white"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-zinc-800">
                <div className="text-xs text-zinc-600">
                    v1.0.0 &bull; Build 2341
                </div>
            </div>
        </aside>
    );
};
