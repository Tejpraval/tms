import { Permission } from "../../../constants/permissions";
import { RBAC_MATRIX } from "../../../constants/rbac";
import { Role as RbacRole } from "../../../constants/roles";

import {
  UserAccessSnapshot,
  SimulationUser,
} from "../simulation.types";

/**
 * Inputs required to build a simulation snapshot
 */
interface SnapshotContext {
  tenantId: string;
  users: SimulationUser[]; // ✅ IMPORTANT
}

/**
 * Build a frozen RBAC access snapshot
 */
export async function buildAccessSnapshot(
  context: SnapshotContext
): Promise<Map<string, UserAccessSnapshot>> {
  const snapshot = new Map<string, UserAccessSnapshot>();

  for (const user of context.users) {
    const permissions = resolveRbac(user);

    snapshot.set(user._id, {
      userId: user._id,
      permissions: new Set(permissions),
    });
  }

  return snapshot;
}

/**
 * RBAC evaluation (pure)
 */
function resolveRbac(user: SimulationUser): Permission[] {
  const rbacRole = mapUserRoleToRbacRole(user.role);
  return RBAC_MATRIX[rbacRole] ?? [];
}

/**
 * Auth-role → RBAC-role bridge
 */
function mapUserRoleToRbacRole(
  role: SimulationUser["role"]
): RbacRole {
  switch (role) {
    case RbacRole.SUPER_ADMIN:
      return RbacRole.SUPER_ADMIN;
    case RbacRole.ADMIN:
      return RbacRole.ADMIN;
    case RbacRole.MANAGER:
      return RbacRole.MANAGER;
    default:
      return RbacRole.TENANT;
  }
}
