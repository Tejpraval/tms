import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePolicyVersions } from "../../policy-management/hooks";
import { useVersionDiff } from "../hooks";
import { VersionSelector } from "../components/VersionSelector";
import { DiffViewer } from "../components/DiffViewer";
import { ArrowLeft } from "lucide-react";

export const ComparisonPage: React.FC = () => {
    const { policyId } = useParams<{ policyId: string }>();
    const navigate = useNavigate();

    const [baseVersion, setBaseVersion] = useState<number | null>(null);
    const [compareVersion, setCompareVersion] = useState<number | null>(null);

    const { data: versions, isLoading: versionsLoading } = usePolicyVersions(policyId || "");

    // Auto-select latest two versions if available
    useEffect(() => {
        if (versions && versions.length >= 2 && !baseVersion && !compareVersion) {
            setBaseVersion(versions[1].version);
            setCompareVersion(versions[0].version); // Latest
        } else if (versions && versions.length === 1 && !baseVersion) {
            setBaseVersion(versions[0].version);
        }
    }, [versions, baseVersion, compareVersion]);

    const { data: diffResult, isLoading: diffLoading } = useVersionDiff(
        policyId || "",
        baseVersion as number,
        compareVersion as number
    );

    if (versionsLoading) {
        return <div className="p-8 animate-pulse text-zinc-400 mt-10">Loading Version History...</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate("/policies")}
                        className="p-2 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 text-zinc-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Version Comparison</h1>
                        <p className="text-sm text-zinc-500 font-mono mt-1">Policy ID: {policyId}</p>
                    </div>
                </div>
            </div>

            {!versions || versions.length < 2 ? (
                <div className="bg-zinc-900 p-8 rounded-xl border border-dashed border-zinc-800 text-center">
                    <p className="text-zinc-500">Not enough versions natively available to explicitly compute a diff.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <VersionSelector
                        versions={versions}
                        baseVersion={baseVersion}
                        compareVersion={compareVersion}
                        onBaseChange={setBaseVersion}
                        onCompareChange={setCompareVersion}
                    />

                    {diffLoading && !!baseVersion && !!compareVersion && (
                        <div className="p-8 text-center text-zinc-500 animate-pulse bg-zinc-900 rounded-lg">
                            Computing diff structures...
                        </div>
                    )}

                    {!diffLoading && diffResult && (
                        <DiffViewer changes={diffResult.changes} />
                    )}
                </div>
            )}
        </div>
    );
};
