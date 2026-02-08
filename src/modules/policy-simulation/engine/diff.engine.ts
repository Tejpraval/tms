// src/modules/policy-simulation/engine/diff.engine.ts

import { Permission } from "../../../constants/permissions";
import {
  PolicySimulationResult,
  UserAccessSnapshot,
  UserPermissionDiff,
} from "../simulation.types";

import { calculateBlastRadius } from "./blastRadius";

/**
 * Diff BEFORE vs AFTER access snapshots
 */
export function diffAccessSnapshots(
  before: Map<string, UserAccessSnapshot>,
  after: Map<string, UserAccessSnapshot>
): PolicySimulationResult {
  const diffs: Record<string, UserPermissionDiff> = {};

  for (const [userId, beforeSnap] of before.entries()) {
    const afterSnap = after.get(userId);
    if (!afterSnap) continue;

    const gained = diffSets(
      afterSnap.permissions,
      beforeSnap.permissions
    );

    const lost = diffSets(
      beforeSnap.permissions,
      afterSnap.permissions
    );

    if (gained.length || lost.length) {
      diffs[userId] = { gained, lost };
    }
  }

  const impactedUsers = Object.keys(diffs).length;

  return {
    summary: {
      impactedUsers,
      blastRadius: calculateBlastRadius(diffs),
    },
    diffs,
  };
}

/**
 * Return items present in A but not in B
 */
function diffSets(
  a: Set<Permission>,
  b: Set<Permission>
): Permission[] {
  return [...a].filter(p => !b.has(p));
}
