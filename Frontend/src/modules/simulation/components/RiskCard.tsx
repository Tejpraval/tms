import React from "react";
import type { SimulationRisk } from "../types";
import { AlertCircle, ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface RiskCardProps {
    risk: SimulationRisk;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk }) => {
    const { score, severity, factors } = risk;

    const severityConfig = {
        LOW: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: ShieldCheck },
        MEDIUM: { color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", icon: Shield },
        HIGH: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: ShieldAlert },
        CRITICAL: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: AlertCircle },
    };

    const config = severityConfig[severity] || severityConfig.MEDIUM;
    const Icon = config.icon;

    return (
        <div className={`rounded-xl border p-5 ${config.bg} ${config.border} shadow-sm transition-all`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Icon className={`h-6 w-6 ${config.color}`} />
                    <h3 className={`text-lg font-bold ${config.color}`}>Risk Analysis</h3>
                </div>
                <div className="text-right">
                    <span className={`text-3xl font-black ${config.color}`}>{score}</span>
                    <span className={`text-sm ml-1 font-medium ${config.color} opacity-80`}>/ 100</span>
                </div>
            </div>

            <div className="border-t pt-4 border-black/5 mt-2">
                <h4 className={`text-sm font-semibold mb-2 ${config.color} opacity-90 uppercase tracking-wider`}>
                    Identified Factors
                </h4>
                <ul className="space-y-1.5">
                    {factors.map((factor, idx) => (
                        <li key={idx} className={`text-sm flex items-start ${config.color}`}>
                            <span className="mr-2 opacity-60">•</span>
                            <span className="font-medium">{factor}</span>
                        </li>
                    ))}
                    {factors.length === 0 && (
                        <li className={`text-sm italic opacity-70 ${config.color}`}>No significant risk factors identified.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};
