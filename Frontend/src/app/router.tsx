//D:\resumeproject\Frontend\src\app\router.tsx
import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import PolicyDetailsPage from "@/pages/policies/PolicyDetailsPage";
import PolicyListPage from "@/pages/policies/PolicyListPage";
import ApprovalConsolePage from "@/pages/approvals/ApprovalConsolePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/policies/:id",
    element: <PolicyDetailsPage />,
  }, 
  {
  path: "/policies",
  element: <PolicyListPage />,
} ,
{
  path: "/approvals",
  element: <ApprovalConsolePage />,
}


]);
