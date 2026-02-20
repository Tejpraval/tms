import React from "react";
import type { SimulationExplanation } from "../types";
import { History, Info, GitCommit } from "lucide-react";

interface ExplanationTimelineProps {
    explanation: SimulationExplanation;
}

export const ExplanationTimeline: React.FC<ExplanationTimelineProps> = ({ explanation }) => {
    const { summary, details, auditTrail } = explanation;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 w-full">
            <div className="flex items-center mb-5 pb-4 border-b border-gray-100">
                <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                    <History className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Evaluation Narrative</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{summary}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Col: Explanations Detail List */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4 flex items-center">
                        <Info className="w-4 h-4 mr-1.5 text-gray-400" /> Decision Rules Map
                    </h4>
                    <ul className="space-y-3">
                        {details.map((detail, idx) => (
                            <li key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-sm">
                                <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded shadow-sm mr-2 align-middle border bg-white
                           data-[type=rbac]:border-blue-200 data-[type=rbac]:text-blue-700 
                           data-[type=abac]:border-purple-200 data-[type=abac]:text-purple-700
                           data-[type=risk]:border-orange-200 data-[type=risk]:text-orange-700
                       " data-type={detail.type}>
                                    {detail.type.toUpperCase()}
                                </span>
                                <span className="text-gray-700 align-middle leading-snug">{detail.message}</span>
                                {detail.impact && (
                                    <div className="mt-2 text-xs text-gray-500 font-medium pl-1 border-l-2 border-gray-300 ml-1">
                                        Targeting: <span className="text-gray-700 font-mono">{detail.impact}</span>
                                    </div>
                                )}
                            </li>
                        ))}
                        {details.length === 0 && (
                            <div className="text-sm text-gray-500 italic">No detailed narratives generated.</div>
                        )}
                    </ul>
                </div>

                {/* Right Col: Vertical Audit Timeline */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4 flex items-center">
                        <GitCommit className="w-4 h-4 mr-1.5 text-gray-400" /> Executive Audit Trail
                    </h4>
                    <div className="relative border-l border-gray-200 ml-3 pl-4 space-y-6 pb-2">
                        {auditTrail.map((trail, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-white border-2 border-indigo-500 ring-4 ring-white" />
                                <p className="text-sm font-medium text-gray-900 leading-tight">{trail.step}</p>
                                <p className="text-xs text-gray-500 font-mono mt-1 opacity-80">{new Date(trail.at).toISOString()}</p>
                            </div>
                        ))}
                        {auditTrail.length === 0 && (
                            <p className="text-sm text-gray-500 italic">Audit trail empty.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
