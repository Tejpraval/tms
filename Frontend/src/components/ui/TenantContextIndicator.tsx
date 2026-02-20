import type { ComponentProps } from "react";

interface TenantContextIndicatorProps extends ComponentProps<"div"> {
    tenantName?: string;
}

export const TenantContextIndicator = ({
    tenantName = "Default Tenant",
    className,
    ...props
}: TenantContextIndicatorProps) => {
    return (
        <div className={`flex items-center gap-2 ${className}`} {...props}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-sm text-zinc-300 font-medium">{tenantName}</span>
        </div>
    );
};
