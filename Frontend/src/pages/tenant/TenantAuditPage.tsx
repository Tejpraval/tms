import { useState, useEffect, useMemo } from "react";
import { apiClient } from "@/lib/axios";
import { API } from "@/config/api.routes";

interface AuditEvent {
    _id: string;
    action: string;
    actor?: string;
    tenantId?: string;
    resource?: string;
    outcome: "ALLOW" | "DENY" | "ERROR";
    createdAt: string;
}

export default function TenantAuditPage() {
    const [events, setEvents] = useState<AuditEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [filterAction, setFilterAction] = useState("");
    const [filterOutcome, setFilterOutcome] = useState("");

    const fetchAuditLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get(API.AUDIT.RECENT);
            const logs = Array.isArray(data) ? data : data.data || [];

            // Backend handles tenant isolation
            setEvents(logs);
        } catch (err: any) {
            setError(err.message || "Failed to load audit stream.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
        const interval = setInterval(() => { fetchAuditLogs(); }, 15000);
        return () => clearInterval(interval);
    }, []);

    const actions = useMemo(() => Array.from(new Set(events.map(e => e.action).filter(Boolean))), [events]);

    const filteredEvents = useMemo(() => {
        return events.filter(e => {
            if (filterAction && e.action !== filterAction) return false;
            if (filterOutcome && e.outcome !== filterOutcome) return false;
            return true;
        });
    }, [events, filterAction, filterOutcome]);

    const getOutcomeColor = (outcome: string) => {
        switch (outcome) {
            case "ALLOW": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            case "DENY": return "text-red-400 bg-red-400/10 border-red-400/20";
            case "ERROR": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            default: return "text-zinc-400 bg-zinc-800 border-zinc-700";
        }
    };

    return (
        <div className="p-8 text-white max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-zinc-900 p-6 rounded-lg border border-zinc-800 gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-2">
                        <span className="animate-pulse">●</span> Audit Stream
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">Real-time security ledger isolated strictly to your tenant workspace.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        className="bg-black border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="">All Actions</option>
                        {actions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>

                    <select
                        value={filterOutcome}
                        onChange={(e) => setFilterOutcome(e.target.value)}
                        className="bg-black border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500"
                    >
                        <option value="">All Outcomes</option>
                        <option value="ALLOW">ALLOW</option>
                        <option value="DENY">DENY</option>
                        <option value="ERROR">ERROR</option>
                    </select>

                    <button
                        onClick={fetchAuditLogs}
                        disabled={loading}
                        className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-sm transition-colors disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-900/40 border border-red-500/50 text-red-200 rounded">
                    {error}
                </div>
            )}

            {loading && events.length === 0 ? (
                <div className="text-zinc-500 p-12 flex flex-col items-center justify-center space-y-4">
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                    <p>Connecting to secure audit firehose...</p>
                </div>
            ) : filteredEvents.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-12 text-center">
                    <h3 className="text-zinc-300 font-semibold text-lg">No Audit Events</h3>
                    <p className="text-zinc-500 text-sm mt-2">No infrastructure events match the current filter criteria for this tenant.</p>
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 text-zinc-500 border-b border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Timestamp</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Outcome</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Action</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Actor</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Resource</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {filteredEvents.map(event => (
                                <tr key={event._id} className="hover:bg-zinc-800/30 transition-colors font-mono text-xs">
                                    <td className="px-6 py-3 text-zinc-400 whitespace-nowrap">
                                        {new Date(event.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-0.5 border rounded ${getOutcomeColor(event.outcome)}`}>
                                            {event.outcome}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 font-semibold text-zinc-200">{event.action}</td>
                                    <td className="px-6 py-3 text-zinc-400 truncate max-w-[150px]" title={event.actor}>
                                        {event.actor || 'SYSTEM'}
                                    </td>
                                    <td className="px-6 py-3 text-zinc-500 truncate max-w-[150px]" title={event.resource}>
                                        {event.resource || '--'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
