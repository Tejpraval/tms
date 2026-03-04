import { Outlet, Navigate, useLocation } from "react-router-dom";
import { SidebarNavigation } from "./SidebarNavigation";
import { HeaderBar } from "./HeaderBar";
import { useAuth } from "@/context/AuthContext";

export const AppLayout = () => {
  const { role } = useAuth();
  const location = useLocation();

  // Route root "/" gracefully to the appropriate dashboard
  if (location.pathname === "/") {
    if (role === "SUPER_ADMIN") {
      return <Navigate to="/platform-overview" replace />;
    } else if (role) {
      return <Navigate to="/dashboard" replace />;
    }
  }

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
