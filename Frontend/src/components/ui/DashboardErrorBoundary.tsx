import React, { Component } from "react";
import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
    children: ReactNode;
    fallbackMessage?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Dashboard Boundary Caught:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-950/20 border border-red-900/50 p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-red-900/20 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-red-400 font-semibold mb-1">Telemetry Interrupted</h3>
                        <p className="text-zinc-500 text-sm">
                            {this.props.fallbackMessage || "Failed to render visual analytics. The source data stream may be malformed or experiencing an outage."}
                        </p>
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                        Attempt Recovery
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
