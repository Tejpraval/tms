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
            return (
                <div className="flex bg-zinc-950 flex-col items-center justify-center min-h-[50vh] space-y-4 p-8">
                    <h2 className="text-xl text-red-500 font-mono font-bold">Authorization Denied</h2>
                    <p className="text-zinc-400 text-sm">Your current role does not have the required permissions to view this sector.</p>
                </div>
            );
        }
    }

    return <>{children}</>;
};
