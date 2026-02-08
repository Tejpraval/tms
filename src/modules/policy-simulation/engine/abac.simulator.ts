//D:\resumeproject\server\src\modules\policy-simulation\engine\abac.simulator.ts
import {
  AbacDecision,
  AbacSimulationChangeType,
  UserAttributeUpdateChange,
  SimulationUser,
} from "../simulation.types";

import { buildAbacSnapshot } from "./abac.snapshot";

/**
 * Input to ABAC simulator
 */
interface AbacSimulatorContext {
  users: SimulationUser[];
  tenants: {
    _id: string;
    tenantId: string;
    status: "ACTIVE" | "ARCHIVED";
  }[];
  change: UserAttributeUpdateChange;
}

/**
 * Run ABAC simulation (before / after)
 */
export function runAbacSimulation(
  context: AbacSimulatorContext
): {
  before: AbacDecision[];
  after: AbacDecision[];
} {
  // 1️⃣ Snapshot BEFORE
  const before = buildAbacSnapshot({
    users: context.users,
    tenants: context.tenants,
  });

  // 2️⃣ Clone users (never mutate originals)
  const simulatedUsers = cloneUsers(context.users);

  // 3️⃣ Apply hypothetical change
  applyAbacChange(simulatedUsers, context.change);

  // 4️⃣ Snapshot AFTER
  const after = buildAbacSnapshot({
    users: simulatedUsers,
    tenants: context.tenants,
  });

  return { before, after };
}

/* ------------------------------------------------------------------ */
/* ------------------------- INTERNALS --------------------------------*/
/* ------------------------------------------------------------------ */

/**
 * Deep clone simulation users
 */
function cloneUsers(users: SimulationUser[]): SimulationUser[] {
  return users.map(user => ({ ...user }));
}

/**
 * Apply ABAC simulation change
 */
function applyAbacChange(
  users: SimulationUser[],
  change: UserAttributeUpdateChange
) {
  if (change.type !== AbacSimulationChangeType.USER_ATTRIBUTE_UPDATE) {
    throw new Error(`Unsupported ABAC change: ${change.type}`);
  }

  const targetUser = users.find(u => u._id === change.userId);
  if (!targetUser) return;

  Object.assign(targetUser, change.attributes);
}
