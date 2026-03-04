import { type FC, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface AuditLog {
    _id: string;
    tenantId: string;
    userId: string;
    action: string;
    entityType: 'POLICY' | 'VERSION' | 'APPROVAL' | 'ROLE' | 'USER';
    entityId: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
}

export const TenantAuditPage: FC = () => {
    const { tenantId } = useAuth();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchAuditLogs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/audit/recent?tenantId=${tenantId || 'SYSTEM'}`);
            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs || []);
                setLastUpdated(new Date());
            }
        } catch (e) {
            console.error("Failed to load audit logs", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuditLogs();
        // Periodically refresh assuming standard operations dashboard
        const interval = setInterval(fetchAuditLogs, 30000);
        return () => clearInterval(interval);
    }, [tenantId]);

    const getTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${Math.max(seconds, 0)} seconds ago`;
        return `${Math.floor(seconds / 60)} minutes ago`;
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Governance Audit Trail</h1>
                <div className="flex items-center space-x-4">
                    {lastUpdated && (
                        <span className="text-sm text-gray-500">
                            Last updated {getTimeAgo(lastUpdated)}
                        </span>
                    )}
                    <button onClick={fetchAuditLogs} className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors text-sm font-medium">
                        Refresh
                    </button>
                </div>
            </div>

            {loading ? (
                // Skeleton Loader
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex space-x-4 border-b border-gray-100 pb-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-2 py-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : logs.length === 0 ? (
                // Empty State
                <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No Audit Logs Found</h3>
                    <p className="text-gray-500 text-sm max-w-sm">There are currently no recorded governance actions for your tenant space.</p>
                </div>
            ) : (
                // Real Audit Logs mapped directly
                <div className="space-y-4">
                    {logs.map(log => (
                        <div key={log._id} className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                            <div className="flex-shrink-0 pt-1">
                                {/* Semantic Icons based on EntityType can be rendered here */}
                                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 mr-3">
                                    <span className="text-sm font-medium leading-none text-blue-700">{log.entityType[0]}</span>
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 break-words">
                                    {log.action}
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">{log.entityType}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    User: <span className="font-medium text-gray-700">{log.userId}</span> • Entity ID: <span className="font-mono">{log.entityId}</span>
                                </p>
                            </div>
                            <div className="flex-shrink-0 whitespace-nowrap text-xs text-gray-400 pl-4 pt-1">
                                {new Date(log.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TenantAuditPage;
