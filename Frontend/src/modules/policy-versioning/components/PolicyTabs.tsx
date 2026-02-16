import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const PolicyTabs = ({ children }: Props) => {
  return (
    <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800">
      {children}
    </div>
  );
};
