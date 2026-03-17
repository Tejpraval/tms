import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/axios';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSampleToken, setShowSampleToken] = useState(false);
    const { login, role, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && role) {
            if (role === 'SUPER_ADMIN') {
                navigate('/platform-overview');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, role, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', {
                email: email.trim(),
                password
            });
            login(response.data);
        } catch (err: any) {
            console.error('Login explicit error:', err);
            const msg = err.message || err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-8 bg-zinc-950 p-6">
            <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl shrink-0">
                <div className="flex justify-center mb-6">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                        Governance Platform
                    </span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="admin@platform.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors pr-10"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>

            {/* Zero-Trust Demo Explanation Panel */}
            <div className="w-full max-w-md p-6 bg-zinc-900/50 border border-blue-900/30 rounded-lg shadow-sm shrink-0">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Secure Enterprise Demo</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    This platform operates on a <strong>Zero-Trust Invitation Model</strong>. Public sign-ups are disabled by design to protect multi-tenant governance data.
                </p>
                <div className="p-3 bg-black/40 border border-zinc-800 rounded mb-4">
                    <ul className="text-sm text-zinc-500 space-y-2 list-disc pl-4">
                        <li>Strict RBAC & ABAC Enforcements</li>
                        <li>Isolated Tenant Workspaces</li>
                        <li>Cryptographic Invite Lifecycles</li>
                    </ul>
                </div>
                <p className="text-zinc-300 text-sm font-medium mb-4">
                    To test the full capability of the Control Plane as a Super Admin or Tenant Operator, please reach out to me. I will provision a secure sandbox environment and generate a single-use onboarding token for you.
                </p>

                <button
                    onClick={() => setShowSampleToken(!showSampleToken)}
                    className="w-full text-left flex items-center justify-between p-3 rounded bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-colors mb-4 group"
                >
                    <span className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">
                        {showSampleToken ? "Hide Sample Onboarding Link" : "View Sample Onboarding Link"}
                    </span>
                    <span className="text-zinc-500 group-hover:text-zinc-300 font-mono font-bold text-lg leading-none">
                        {showSampleToken ? "−" : "+"}
                    </span>
                </button>

                {showSampleToken && (
                    <div className="mb-6 bg-black border border-emerald-500/50 p-6 rounded-lg text-left shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 bg-emerald-500 animate-ping rounded-full"></div>
                            <div className="text-emerald-400 font-mono text-sm uppercase tracking-widest font-bold">Public Onboarding Vector Generated</div>
                        </div>
                        <p className="text-xs text-emerald-500/70 mb-4 font-mono">
                            // SECURE_SANDBOX_CONTEXT_ESTABLISHED
                            <br />
                            // AWAITING_OPERATOR_ACCEPTANCE
                        </p>
                        <div className="bg-[#050f0a] border border-emerald-900/50 p-4 relative overflow-hidden text-xs font-mono break-all rounded shadow-inner">
                            <span className="text-zinc-500 select-none">{'> '}</span>
                            <span className="text-emerald-300">https://{window.location.hostname}/accept-invite?token=</span>
                            <span className="text-cyan-400 font-bold animate-pulse">demo_7f8a9b2c1d3e4f5g6h7j8k9l</span>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800/50">
                    <a href="https://github.com/Tejpraval" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors text-sm flex items-center gap-1.5 font-medium">
                        GitHub
                    </a>
                    <span className="text-zinc-700">•</span>
                    <a href="https://www.linkedin.com/in/tej-praval-pula/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1.5 font-medium">
                        LinkedIn
                    </a>
                    <span className="text-zinc-700">•</span>
                    <a href="mailto:tejpraval32@gmail.com" className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm flex items-center gap-1.5 font-medium">
                        Email Me
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
