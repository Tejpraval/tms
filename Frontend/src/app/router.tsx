//D:\resumeproject\Frontend\src\app\router.tsx
import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import PolicyDetailsPage from "@/pages/policies/PolicyDetailsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/policies/:id",
    element: <PolicyDetailsPage />,
  },
]);
