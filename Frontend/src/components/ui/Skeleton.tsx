import React from "react";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-zinc-800/50 rounded-md ${className}`}
        />
    );
}

// Pre-configured skeleton layouts for common use cases
export function SkeletonCard() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
        </div>
    );
}

export function SkeletonTable({ rows = 3 }: { rows?: number }) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col mt-6">
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-8 w-64 rounded-md" />
            </div>
            <div className="p-4 space-y-4">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/6" />
                        <Skeleton className="h-4 w-1/6" />
                        <Skeleton className="h-6 w-12 rounded" />
                    </div>
                ))}
            </div>
        </div>
    );
}
