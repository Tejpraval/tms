import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/lib/axios';

export type Role = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "TENANT_ADMIN" | "TENANT";

interface JwtPayload {
    userId: string;
    role: Role;
    tenantId?: string;
    impersonating?: boolean;
    exp: number;
}

interface AuthContextType {
    accessToken: string | null;
    role: Role | null;
    tenantId: string | null;
    tenantName: string | null;
    customRoleName: string | null;
    permissions: string[] | null;
    isAuthenticated: boolean;
    impersonating: boolean;
    login: (data: { accessToken?: string }) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [tenantName, setTenantName] = useState<string | null>(null);
    const [customRoleName, setCustomRoleName] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<string[] | null>(null);
    const [impersonating, setImpersonating] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const decoded = jwtDecode<JwtPayload>(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        throw new Error('Token expired');
                    }

                    // Fetch permissions utilizing the native Bearer token natively
                    const res = await apiClient.get('/auth/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    console.log("Effective permissions:", res.data.permissions || []);

                    const effectiveRole = decoded.impersonating && decoded.impersonatedRole ? decoded.impersonatedRole : decoded.role;
                    const effectiveTenantId = decoded.impersonating && decoded.impersonatedTenantId ? decoded.impersonatedTenantId : (decoded.tenantId || null);

                    setAccessToken(token);
                    setRole(effectiveRole);
                    setTenantId(effectiveTenantId);
                    setTenantName(res.data.tenantName || null);
                    setCustomRoleName(res.data.customRoleName || null);
                    setPermissions(res.data.permissions || []);
                    setImpersonating(!!decoded.impersonating);
                } catch (error) {
                    console.error('Invalid token or failed fetching permissions during initialization', error);
                    localStorage.removeItem('accessToken');
                    setPermissions(null);
                    setTenantName(null);
                    setCustomRoleName(null);
                    setImpersonating(false);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (data: { accessToken?: string }) => {
        try {
            if (!data || !data.accessToken) {
                throw new Error("Invalid credentials");
            }
            const token = data.accessToken;
            const decoded = jwtDecode<JwtPayload>(token);

            // Fetch permissions matching login execution strictly
            const res = await apiClient.get('/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Effective permissions:", res.data.permissions || []);

            const effectiveRole = decoded.impersonating && decoded.impersonatedRole ? decoded.impersonatedRole : decoded.role;
            const effectiveTenantId = decoded.impersonating && decoded.impersonatedTenantId ? decoded.impersonatedTenantId : (decoded.tenantId || null);

            localStorage.setItem('accessToken', token);
            setAccessToken(token);
            setRole(effectiveRole);
            setTenantId(effectiveTenantId);
            setTenantName(res.data.tenantName || null);
            setCustomRoleName(res.data.customRoleName || null);
            setPermissions(res.data.permissions || []);
            setImpersonating(!!decoded.impersonating);
        } catch (error) {
            console.error('Failed to decode token or fetch permissions on login', error);
            throw error; // propagate to LoginPage
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setRole(null);
        setTenantId(null);
        setTenantName(null);
        setCustomRoleName(null);
        setPermissions(null);
        setImpersonating(false);
    };

    return (
        <AuthContext.Provider value={{ accessToken, role, tenantId, tenantName, customRoleName, permissions, isAuthenticated: !!accessToken, impersonating, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
