import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader, CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@/lib/axios";

export default function AcceptInvitePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inviteEmail, setInviteEmail] = useState<string | null>(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid invitation link. No token provided.");
            setLoading(false);
            return;
        }

        const validateToken = async () => {
            try {
                const { data } = await apiClient.get(`/invites/validate?token=${token}`);
                setInviteEmail(data.data.email);
            } catch (err: any) {
                setError(err.response?.data?.message || "This invitation link is invalid, expired, or has already been used.");
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await apiClient.post("/invites/accept", {
                token,
                newPassword: password
            });
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to set password. The invite might have expired.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center text-cyan-500">
                    <Loader className="w-8 h-8 animate-spin mb-4" />
                    <p className="font-mono text-zinc-400">Validating Cryptographic Identity...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-zinc-900 border border-green-500/50 rounded-xl p-8 text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-white font-mono">Identity Verified</h2>
                    <p className="text-zinc-400 text-sm">Your secure portal account has been provisioned successfully.</p>
                    <p className="text-zinc-500 text-xs mt-4">Redirecting to login gateway...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background cyber pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_10%,transparent_100%)] pointer-events-none" />

            <div className="w-full max-w-md z-10">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="p-8 border-b border-zinc-800 text-center">
                        <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                            <Shield className="w-6 h-6 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white font-mono mb-2">Initialize Account</h2>

                        {inviteEmail ? (
                            <p className="text-zinc-400 text-sm">
                                Complete onboarding for<br />
                                <span className="font-mono text-cyan-300 bg-cyan-950/30 px-2 py-0.5 rounded mt-2 inline-block border border-cyan-900/50">
                                    {inviteEmail}
                                </span>
                            </p>
                        ) : null}
                    </div>

                    <div className="p-8">
                        {error ? (
                            <div className="bg-black/50 border border-red-500/50 rounded-lg p-5 text-center space-y-3">
                                <XCircle className="w-10 h-10 text-red-500 mx-auto" />
                                <p className="text-red-400 font-medium text-sm">Access Denied</p>
                                <p className="text-zinc-500 text-xs">{error}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-zinc-400 text-sm font-medium mb-2">Establish Passphrase</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-black border border-zinc-700 rounded text-white px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                                            placeholder="Min. 8 characters"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-zinc-400 text-sm font-medium mb-2">Verify Passphrase</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full bg-black border border-zinc-700 rounded text-white px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                                        placeholder="Repeat passphrase"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded mt-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                                >
                                    {submitting ? <Loader className="w-5 h-5 animate-spin" /> : "Encrypt Credentials & Enter"}
                                </button>
                                <p className="text-xs text-zinc-600 text-center mt-4">
                                    By proceeding, you verify your identity is matched to the cryptograph link provided to you.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
