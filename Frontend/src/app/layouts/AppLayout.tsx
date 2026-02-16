import type { ReactNode } from "react";
import { TopCommandBar } from "./TopCommandBar";

interface Props {
  children: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      
      {/* Global Command Layer */}
      <TopCommandBar />

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

    </div>
  );
};
