import React from "react";

interface SLACardProps {
    breaches: number;
}

export const SLACard: React.FC<SLACardProps> = ({ breaches }) => {
    const isHealthy = breaches === 0;
    const colorClass = isHealthy ? "text-emerald-400" : "text-amber-500";
    const bgClass = isHealthy ? "bg-emerald-500/10" : "bg-amber-500/10";
    const iconColor = isHealthy ? "text-emerald-400" : "text-amber-500";

    return (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br transition-opacity opacity-0 group-hover:opacity-100 ${isHealthy ? 'from-emerald-500/5' : 'from-amber-500/5'} to-transparent`} />

            <div className="flex justify-between items-start mb-4 relative">
                <div>
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Approval SLA Breaches</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">&gt; 48h Resolution Time</p>
                </div>
                <div className={`p-2 rounded-lg shrink-0 ${bgClass}`}>
                    <svg className={`w-5 h-5 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>

            <div className="flex items-baseline gap-2 relative">
                <span className={`text-4xl font-bold font-mono ${colorClass}`}>{breaches}</span>
                <span className="text-sm font-medium text-zinc-500">incidents</span>
            </div>

            {!isHealthy && (
                <div className="mt-4 text-xs font-medium text-amber-500/80 bg-amber-500/10 py-1.5 px-3 rounded-md inline-block">
                    Attention Required
                </div>
            )}
        </div>
    );
};
