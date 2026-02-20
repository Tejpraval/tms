import React from "react";
import type { VersionStatus } from "../types";

interface StatusBadgeProps {
    status: VersionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let bgColor = "bg-gray-100 text-gray-800 border-gray-200";
    let label = status.replace("_", " ").toUpperCase();

    switch (status) {
        case "draft":
            bgColor = "bg-blue-50 text-blue-700 border-blue-200";
            break;
        case "pending_approval":
            bgColor = "bg-yellow-50 text-yellow-700 border-yellow-200";
            break;
        case "approved":
            bgColor = "bg-green-50 text-green-700 border-green-200";
            break;
        case "active":
            bgColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
            break;
        case "deprecated":
            bgColor = "bg-gray-100 text-gray-500 border-gray-200";
            break;
        case "rolled_back":
            bgColor = "bg-red-50 text-red-700 border-red-200";
            break;
    }

    return (
        <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgColor}`}
        >
            {label}
        </span>
    );
};
