// src/modules/policy-simulation/engine/blastRadius.ts

import { Permission } from "../../../constants/permissions";
import { BlastRadius, UserPermissionDiff } from "../simulation.types";

/**
 * Permission sensitivity scoring
 * (extend freely)
 */
const PERMISSION_RISK_SCORE: Partial<Record<Permission, number>> = {
  TENANT_CREATE: 4,
  TENANT_UPDATE: 4,
  TENANT_DELETE: 5,

  USER_MANAGE: 5,
  PROPERTY_MANAGE: 4,

  PAYMENT_COLLECT: 4,
  PAYMENT_READ: 3,
};

/**
 * Calculate blast radius for a simulation
 */
export function calculateBlastRadius(
  diffs: Record<string, UserPermissionDiff>
): BlastRadius {
  let maxRisk = 0;
  let impactedUsers = 0;

  for (const diff of Object.values(diffs)) {
    impactedUsers++;

    const gainedRisk = diff.gained.reduce(
      (sum, perm) => sum + (PERMISSION_RISK_SCORE[perm] ?? 1),
      0
    );

    maxRisk = Math.max(maxRisk, gainedRisk);
  }

  // 🔥 Critical: high-risk perms, even to few users
  if (maxRisk >= 5) return "CRITICAL";

  // ⚠️ High: medium risk to many users
  if (maxRisk >= 4 || impactedUsers > 50) return "HIGH";

  // ⚠️ Medium: moderate impact
  if (impactedUsers > 10) return "MEDIUM";

  return "LOW";
}
