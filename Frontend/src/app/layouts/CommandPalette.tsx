import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listPolicies } from "@/modules/policy-versioning/api";
import type { Policy } from "@/types/policy.types";

interface Command {
  id: string;
  label: string;
  path: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STATIC_COMMANDS: Command[] = [
  { id: "dashboard", label: "Go to Dashboard", path: "/" },
  { id: "approvals", label: "Open Approval Console", path: "/approvals" },
  { id: "rollouts", label: "Open Rollout Monitor", path: "/rollouts" },
];

export const CommandPalette = ({ isOpen, onClose }: Props) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

const { data: policies = [] } = useQuery({
  queryKey: ["command-policies"],
  queryFn: (): Promise<Policy[]> => listPolicies(),
  enabled: isOpen,
});


const policyCommands: Command[] = useMemo(() => {
  return policies.map((policy) => ({
    id: policy._id,
    label: `Policy: ${policy.policyId}`,
    path: `/policies/${policy._id}`,
  }));
}, [policies]);


  const allCommands: Command[] = useMemo(() => {
    return [...STATIC_COMMANDS, ...policyCommands];
  }, [policyCommands]);

  const filtered: Command[] = useMemo(() => {
    return allCommands.filter((cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [allCommands, query]);

  const handleSelect = useCallback(
    (path: string) => {
      navigate(path);
      setQuery("");
      setSelectedIndex(0);
      onClose();
    },
    [navigate, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
      }

      if (e.key === "Enter" && filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex].path);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, filtered, selectedIndex, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-40 z-50 animate-fadeIn">
      <div className="w-full max-w-xl bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">

        <input
          autoFocus
          type="text"
          placeholder="Search policies or run command..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          className="w-full bg-transparent px-5 py-4 border-b border-zinc-800 text-white focus:outline-none"
        />

        <div className="max-h-80 overflow-y-auto">
          {filtered.map((cmd, index) => (
            <button
              key={cmd.id}
              onClick={() => handleSelect(cmd.path)}
              className={`w-full text-left px-5 py-3 transition-colors ${
                index === selectedIndex
                  ? "bg-zinc-800 text-white"
                  : "hover:bg-zinc-800 text-zinc-300"
              }`}
            >
              {cmd.label}
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="px-5 py-4 text-sm text-zinc-500">
              No results found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
