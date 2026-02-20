import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '@/lib/axios';

export type Role = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "TENANT_ADMIN" | "TENANT";

interface JwtPayload {
    userId: string;
    role: Role;
    tenantId?: string;
    exp: number;
}

interface AuthContextType {
    accessToken: string | null;
    role: Role | null;
    tenantId: string | null;
    permissions: string[] | null;
    isAuthenticated: boolean;
    login: (data: { accessToken?: string }) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<string[] | null>(null);
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

                    setAccessToken(token);
                    setRole(decoded.role);
                    setTenantId(decoded.tenantId || null);
                    setPermissions(res.data.permissions || []);
                } catch (error) {
                    console.error('Invalid token or failed fetching permissions during initialization', error);
                    localStorage.removeItem('accessToken');
                    setPermissions(null);
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

            localStorage.setItem('accessToken', token);
            setAccessToken(token);
            setRole(decoded.role);
            setTenantId(decoded.tenantId || null);
            setPermissions(res.data.permissions || []);
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
        setPermissions(null);
    };

    return (
        <AuthContext.Provider value={{ accessToken, role, tenantId, permissions, isAuthenticated: !!accessToken, login, logout, loading }}>
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
