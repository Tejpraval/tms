import { useState } from "react";
import { useCreateDraft } from "../hooks";

interface Props {
    policyId: string;
    onClose: () => void;
    isOpen: boolean;
}

export const CreateDraftModal = ({ policyId, onClose, isOpen }: Props) => {
    const createDraft = useCreateDraft();

    const [description, setDescription] = useState("");
    const [targetResource, setTargetResource] = useState("/api/finance/*");
    const [action, setAction] = useState("READ");
    const [effect, setEffect] = useState("ALLOW");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Construct realistic policy rules mapping
        const structuredRules = [
            {
                resource: targetResource,
                actions: [action],
                effect: effect,
                conditions: { description },
            }
        ];

        createDraft.mutate({
            id: policyId,
            rules: structuredRules
        }, {
            onSuccess: () => {
                setDescription("");
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-white">Create Policy Draft</h2>
                    <p className="text-sm text-zinc-400 mt-1">Configure realistic rule adjustments for the new candidate version.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Change Description</label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Elevating finance team access boundaries..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Target Resource</label>
                            <input
                                type="text"
                                required
                                value={targetResource}
                                onChange={(e) => setTargetResource(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Allowed Action</label>
                            <select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                            >
                                <option value="READ">READ</option>
                                <option value="WRITE">WRITE</option>
                                <option value="DELETE">DELETE</option>
                                <option value="EXECUTE">EXECUTE</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Rule Effect</label>
                        <select
                            value={effect}
                            onChange={(e) => setEffect(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                            <option value="ALLOW">ALLOW Access</option>
                            <option value="DENY">DENY Access</option>
                        </select>
                    </div>

                    <div className="pt-6 flex justify-end gap-3 flex-wrap">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createDraft.isPending}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {createDraft.isPending ? "Generating..." : "Generate Draft"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
