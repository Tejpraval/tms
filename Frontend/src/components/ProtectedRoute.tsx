import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredPermissions?: string[];
}

export const ProtectedRoute = ({ children, requiredPermissions }: ProtectedRouteProps) => {
    const { isAuthenticated, role, permissions, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-500">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
        if (role === 'SUPER_ADMIN') {
            // SUPER_ADMIN dynamically bypasses tenant boundaries inherently natively.
            return <>{children}</>;
        }

        const hasAccess = permissions && requiredPermissions.every(p => permissions.includes(p));

        if (!hasAccess) {
            if (location.pathname === '/') {
                return (
                    <div className="flex bg-zinc-950 flex-col items-center justify-center h-full space-y-4">
                        <h2 className="text-xl text-red-400 font-semibold">Unauthorized Access</h2>
                        <p className="text-zinc-500">You lack the necessary permissions to view this resource.</p>
                    </div>
                );
            }
            return <Navigate to="/" replace />; // Safely fallback for other paths
        }
    }

    return <>{children}</>;
};
