import React from "react";

interface VelocityCardProps {
    velocity: number;
}

export const VelocityCard: React.FC<VelocityCardProps> = ({ velocity }) => {
    return (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex justify-between items-start mb-4 relative">
                <div>
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Policy Change Velocity</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Updates matching last 30 days</p>
                </div>
                <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>

            <div className="flex items-baseline gap-2 relative">
                <span className="text-4xl font-bold font-mono text-zinc-100">{velocity}</span>
                <span className="text-sm font-medium text-zinc-500">versions</span>
            </div>

            <div className="mt-4 w-full bg-zinc-800 rounded-full h-1">
                <div className="bg-indigo-500 h-1 rounded-full w-1/3" />
            </div>
        </div>
    );
};
