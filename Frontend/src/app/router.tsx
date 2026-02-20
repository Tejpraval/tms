import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import PolicyDetailsPage from "@/pages/policies/PolicyDetailsPage";
import ApprovalConsolePage from "@/pages/approvals/ApprovalConsolePage";
import PlatformOverviewPage from "@/pages/platform-overview/PlatformOverviewPage";
import TenantDrilldownPage from "@/pages/platform/TenantDrilldownPage";
import TenantRegistryPage from "@/pages/platform/TenantRegistryPage";
import SystemAuditPage from "@/pages/platform/SystemAuditPage";
import CrossTenantRolloutsPage from "@/pages/platform/CrossTenantRolloutsPage";
import TenantDashboardPage from "@/pages/tenant/TenantDashboardPage";
import { PolicyManagementPage } from "@/pages/tenant/PolicyManagementPage";
import TenantRolloutsPage from "@/pages/tenant/TenantRolloutsPage";
import TenantAuditPage from "@/pages/tenant/TenantAuditPage";
import TenantRolesPage from "@/pages/tenant/TenantRolesPage";
import TenantUsersPage from "@/pages/tenant/TenantUsersPage";
import LoginPage from "@/pages/auth/LoginPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredPermissions={['TENANT_READ']}>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "platform-overview",
        element: (
          <ProtectedRoute>
            <PlatformOverviewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "platform/tenant/:tenantId",
        element: (
          <ProtectedRoute>
            <TenantDrilldownPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tenant-registry",
        element: (
          <ProtectedRoute>
            <TenantRegistryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "system-audit",
        element: (
          <ProtectedRoute>
            <SystemAuditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "cross-tenant-rollouts",
        element: (
          <ProtectedRoute>
            <CrossTenantRolloutsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requiredPermissions={['TENANT_READ']}>
            <TenantDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "policies/:id",
        element: (
          <ProtectedRoute requiredPermissions={['POLICY_READ']}>
            <PolicyDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "policies",
        element: (
          <ProtectedRoute requiredPermissions={['POLICY_READ']}>
            <PolicyManagementPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "rollouts",
        element: (
          <ProtectedRoute requiredPermissions={['POLICY_ADMIN']}>
            <TenantRolloutsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tenant-audit",
        element: (
          <ProtectedRoute requiredPermissions={['TENANT_READ']}>
            <TenantAuditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "roles",
        element: (
          <ProtectedRoute requiredPermissions={['USER_MANAGE']}>
            <TenantRolesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredPermissions={['USER_MANAGE']}>
            <TenantUsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "approvals",
        element: (
          <ProtectedRoute requiredPermissions={['POLICY_APPROVE']}>
            <ApprovalConsolePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "evaluations",
        element: (
          <ProtectedRoute requiredPermissions={['POLICY_READ']}>
            <div className="p-6 text-zinc-500">
              <h2 className="text-xl font-semibold mb-2 text-zinc-300">Evaluations History</h2>
              <p>This feature is not fully implemented in the current demo.</p>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: (
          <div className="p-6 text-zinc-500">
            <h2 className="text-xl font-semibold mb-2 text-zinc-300">Under Construction</h2>
            <p>This feature is not fully implemented in the current demo.</p>
          </div>
        ),
      },
    ],
  },
]);
