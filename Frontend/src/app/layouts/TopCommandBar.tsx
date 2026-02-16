import { useEffect, useState } from "react";
import { CommandPalette } from "./CommandPalette";

const environments = ["DEV", "STAGING", "PROD"] as const;
type Environment = typeof environments[number];

export const TopCommandBar = () => {
  const [env, setEnv] = useState<Environment>("DEV");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(true);
      }

      if (e.key === "Escape") {
        setIsPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="w-full bg-zinc-950 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        
        {/* Environment */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">
            Environment
          </span>

          <select
            value={env}
            onChange={(e) =>
              setEnv(e.target.value as Environment)
            }
            className="bg-zinc-900 border border-zinc-800 rounded-md px-3 py-1 text-sm"
          >
            {environments.map((environment) => (
              <option key={environment}>
                {environment}
              </option>
            ))}
          </select>
        </div>

        {/* Search Shortcut */}
        <button
          onClick={() => setIsPaletteOpen(true)}
          className="bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 transition"
        >
          Search... (Ctrl + K)
        </button>

        {/* Right Label */}
        <div className="text-sm text-zinc-500">
          Governance Control Plane
        </div>
      </div>

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />
    </>
  );
};
