interface Props {
  breach: number;
  rollouts: number;
  setBreach: (v: number | null) => void;
  setRollouts: (v: number | null) => void;
}

export const StressSimulatorPanel = ({
  breach,
  rollouts,
  setBreach,
  setRollouts,
}: Props) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl space-y-4">
      <h2 className="text-lg font-semibold">
        Stress Scenario Simulator
      </h2>

      <div>
        <p className="text-sm">SLA Breach %</p>
        <input
          type="range"
          min="0"
          max="100"
          value={breach ?? 0}
          onChange={(e) => setBreach(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <p className="text-sm">Active Rollouts</p>
        <input
          type="range"
          min="0"
          max="10"
          value={rollouts ?? 0}
          onChange={(e) => setRollouts(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <button
        onClick={() => {
          setBreach(null);
          setRollouts(null);
        }}
        className="text-xs text-zinc-400"
      >
        Reset Simulation
      </button>
    </div>
  );
};
