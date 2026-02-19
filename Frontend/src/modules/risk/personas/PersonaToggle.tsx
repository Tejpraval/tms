import type { RiskPersona } from "./types";

interface Props {
  persona: RiskPersona;
  setPersona: (p: RiskPersona) => void;
}

export const PersonaToggle = ({
  persona,
  setPersona,
}: Props) => {
  return (
    <div className="flex gap-2">
      {["CFO", "CTO", "CISO"].map((p) => (
        <button
          key={p}
          onClick={() => setPersona(p as RiskPersona)}
          className={`px-3 py-1 rounded text-xs ${
            persona === p
              ? "bg-blue-600"
              : "bg-zinc-800"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
};
