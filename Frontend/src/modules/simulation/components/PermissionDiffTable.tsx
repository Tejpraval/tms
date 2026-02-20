import React, { useState } from "react";
import type { RbacDiffRecord } from "../types";
import { ChevronDown, ChevronRight, UserMinus, UserPlus, Key } from "lucide-react";

interface PermissionDiffTableProps {
    diffs: Record<string, RbacDiffRecord>;
}

export const PermissionDiffTable: React.FC<PermissionDiffTableProps> = ({ diffs }) => {
    const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

    const userIds = Object.keys(diffs);

    if (userIds.length === 0) {
        return (
            <div className="p-4 text-center border rounded-lg bg-gray-50 border-dashed">
                <p className="text-gray-500 text-sm">No RBAC permission modifications identified.</p>
            </div>
        );
    }

    const toggleUser = (userId: string) => {
        setExpandedUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center">
                <Key className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase">Permission Audit Mappings</h3>
            </div>

            <div className="divide-y divide-gray-100">
                {userIds.map((userId) => {
                    const record = diffs[userId];
                    const isExpanded = !!expandedUsers[userId];

                    return (
                        <div key={userId} className="flex flex-col group">
                            <button
                                onClick={() => toggleUser(userId)}
                                className="flex items-center justify-between w-full px-5 py-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            >
                                <div className="flex items-center space-x-3">
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                                    )}
                                    <span className="text-sm font-medium font-mono text-gray-900">{userId}</span>
                                </div>
                                <div className="flex gap-3">
                                    {record.gained.length > 0 && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                            +{record.gained.length}
                                        </span>
                                    )}
                                    {record.lost.length > 0 && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                            -{record.lost.length}
                                        </span>
                                    )}
                                </div>
                            </button>

                            {isExpanded && (
                                <div className="px-10 py-3 pb-4 bg-gray-50/50 space-y-3 shadow-inner">
                                    {record.gained.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-green-700 uppercase mb-2 flex items-center">
                                                <UserPlus className="w-3.5 h-3.5 mr-1" /> Gained
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {record.gained.map((perm) => (
                                                    <span key={perm} className="px-2 py-1 bg-green-50 border border-green-200 text-green-700 font-mono text-xs rounded shadow-sm">
                                                        {perm}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {record.lost.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-semibold text-red-700 uppercase mb-2 flex items-center mt-3">
                                                <UserMinus className="w-3.5 h-3.5 mr-1" /> Revoked
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {record.lost.map((perm) => (
                                                    <span key={perm} className="px-2 py-1 bg-red-50 border border-red-200 text-red-700 font-mono text-xs rounded shadow-sm line-through opacity-80">
                                                        {perm}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
