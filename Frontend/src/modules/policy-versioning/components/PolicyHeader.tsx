import type { Policy } from "../types";

interface Props {
  policy: Policy;
}

export const PolicyHeader = ({ policy }: Props) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">
          {policy.name}
        </h1>
        <p className="text-zinc-400">
          Policy ID: {policy.policyId}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm text-zinc-500">
          Release Mode
        </p>
        <p className="font-medium">
          {policy.releaseMode}
        </p>
      </div>
    </div>
  );
};
