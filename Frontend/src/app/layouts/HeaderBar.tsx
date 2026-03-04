import { useEffect, useState } from "react";
import { CommandPalette } from "./CommandPalette";
import { RoleBadge } from "@/components/ui/RoleBadge";
import { TenantContextIndicator } from "@/components/ui/TenantContextIndicator";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/axios";
import { AlertTriangle, LogOut } from "lucide-react";

const environments = ["DEV", "STAGING", "PROD"] as const;
type Environment = (typeof environments)[number];

export const HeaderBar = () => {
    const [env, setEnv] = useState<Environment>("DEV");
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const { role, tenantName, customRoleName, login, logout, impersonating } = useAuth();
    const [exiting, setExiting] = useState(false);

    const handleExitImpersonation = async () => {
        setExiting(true);
        try {
            const res = await apiClient.post("/auth/impersonate/exit");
            await login({ accessToken: res.data.accessToken });
        } catch (err: any) {
            console.error("Failed to exit impersonation", err);
            alert("Failed to exit impersonation state. Please log out and back in.");
        } finally {
            setExiting(false);
        }
    };

    // Keyboard Shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === "k") {
                e.preventDefault();
                setIsPaletteOpen(true);
            }

            if (e.key === "Escape") {
                setIsPaletteOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="flex flex-col shrink-0">
            {impersonating && (
                <div className="bg-orange-500/20 border-b border-orange-500/50 py-1.5 px-6 flex items-center justify-center gap-4 animate-pulse-slow">
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-200 text-sm font-medium">
                        SUPER ADMIN WARNING: You are currently impersonating <strong className="text-white">{tenantName || "Unknown Tenant"}</strong> as a <strong className="text-white">Tenant Admin</strong>.
                    </span>
                    <button
                        onClick={handleExitImpersonation}
                        disabled={exiting}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors shadow-lg"
                    >
                        <LogOut className="w-3 h-3" />
                        {exiting ? "Exiting..." : "Exit Impersonation"}
                    </button>
                </div>
            )}
            <header className="h-16 bg-zinc-950 border-b border-zinc-800 px-6 flex items-center justify-between">
                {/* Left: Search & Context */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPaletteOpen(true)}
                        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition group"
                    >
                        <span className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 group-hover:border-zinc-700">
                            ⌘ K
                        </span>
                        <span>Search...</span>
                    </button>
                </div>

                {/* Right: Environment, Role, Tenant */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 border-r border-zinc-800 pr-6">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                            Env
                        </span>
                        <select
                            value={env}
                            onChange={(e) => setEnv(e.target.value as Environment)}
                            className="bg-zinc-900 border border-zinc-800 rounded text-xs px-2 py-1 text-zinc-300 focus:outline-none focus:border-zinc-700 hover:border-zinc-700 transition cursor-pointer"
                        >
                            {environments.map((environment) => (
                                <option key={environment}>{environment}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        {role === "SUPER_ADMIN" ? (
                            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded text-xs font-semibold tracking-wide shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                PLATFORM MODE
                            </span>
                        ) : (
                            <TenantContextIndicator tenantName={tenantName || "Unknown Tenant"} />
                        )}
                        <RoleBadge role={customRoleName || (role === "SUPER_ADMIN" ? "Super Admin" : role === "TENANT_ADMIN" ? "Tenant Admin" : role === "MANAGER" ? "Manager" : "Tenant Member")} />

                        <button
                            onClick={logout}
                            className="text-xs px-3 py-1.5 rounded transition bg-zinc-800/50 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 ml-2"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            <CommandPalette
                isOpen={isPaletteOpen}
                onClose={() => setIsPaletteOpen(false)}
            />
        </div>
    );
};
