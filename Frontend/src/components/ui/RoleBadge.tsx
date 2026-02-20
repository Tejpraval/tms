import type { ComponentProps } from "react";

interface RoleBadgeProps extends ComponentProps<"div"> {
    role?: string;
}

export const RoleBadge = ({ role = "Viewer", className, ...props }: RoleBadgeProps) => {
    const getRoleColor = (r: string) => {
        switch (r.toLowerCase()) {
            case "admin":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            case "editor":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            default:
                return "bg-zinc-800 text-zinc-400 border-zinc-700";
        }
    };

    return (
        <div
            className={`px-2 py-0.5 rounded text-xs font-medium border ${getRoleColor(
                role
            )} ${className}`}
            {...props}
        >
            {role}
        </div>
    );
};
