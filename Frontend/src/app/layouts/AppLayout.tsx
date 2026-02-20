import { Outlet } from "react-router-dom";
import { SidebarNavigation } from "./SidebarNavigation";
import { HeaderBar } from "./HeaderBar";

export const AppLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">
      {/* Sidebar */}
      <SidebarNavigation />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderBar />

        <main className="flex-1 overflow-auto bg-zinc-900/50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
