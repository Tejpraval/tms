import { RBAC_MATRIX } from "../../../constants/rbac";
import { Permission } from "../../../constants/permissions";
import { Role as RbacRole } from "../../../constants/roles";

import { buildAccessSnapshot } from "./snapshot";
import {
  SimulationChange,
  SimulationChangeType,
  UserAccessSnapshot,
  SimulationUser,
} from "../simulation.types";

interface SimulatorContext {
  tenantId: string;
  users: SimulationUser[];
  change: SimulationChange;
}

export async function runPolicySimulation(
  context: SimulatorContext
): Promise<{
  before: Map<string, UserAccessSnapshot>;
  after: Map<string, UserAccessSnapshot>;
}> {
  const before = await buildAccessSnapshot({
    tenantId: context.tenantId,
    users: context.users,
  });

  const simulatedRbac = cloneRbacMatrix(RBAC_MATRIX);
  applySimulationChange(simulatedRbac, context.change);

  const after = await buildSimulatedSnapshot(
    context.users,
    simulatedRbac
  );

  return { before, after };
}

/* ---------------- Internals ---------------- */

function cloneRbacMatrix(
  matrix: Record<RbacRole, Permission[]>
): Record<RbacRole, Permission[]> {
  return Object.fromEntries(
    Object.entries(matrix).map(([role, perms]) => [
      role,
      [...perms],
    ])
  ) as Record<RbacRole, Permission[]>;
}

function applySimulationChange(
  rbac: Record<RbacRole, Permission[]>,
  change: SimulationChange
) {
  if (change.type === SimulationChangeType.ROLE_PERMISSION_UPDATE) {
    rbac[change.roleId] = [...change.permissions];
  }
}

async function buildSimulatedSnapshot(
  users: SimulationUser[],
  simulatedRbac: Record<RbacRole, Permission[]>
): Promise<Map<string, UserAccessSnapshot>> {
  const snapshot = new Map<string, UserAccessSnapshot>();

  for (const user of users) {
    const permissions = simulatedRbac[user.role] ?? [];

    snapshot.set(user._id, {
      userId: user._id,
      permissions: new Set(permissions),
    });
  }

  return snapshot;
}
