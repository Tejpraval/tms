import { AbacDecision } from "../simulation.types";
import {
  canReadTenant,
  canUpdateTenant,
  canDeleteTenant,
} from "../../../policies/tenant.policy";

import { SimulationUser } from "../simulation.types";
import { AbacUser, TenantResource } from "../../../policies/abac.types";

/**
 * Snapshot input
 */
interface AbacSnapshotContext {
  users: SimulationUser[];
  tenants: {
    _id: string;
    tenantId: string;
    status: "ACTIVE" | "ARCHIVED";
  }[];
}

/**
 * Build ABAC decision snapshot (before / after)
 */
export function buildAbacSnapshot(
  context: AbacSnapshotContext
): AbacDecision[] {
  const decisions: AbacDecision[] = [];

  for (const user of context.users) {
    const abacUser = toAbacUser(user); // ✅ user adapter

    for (const tenant of context.tenants) {
      const abacTenant = toTenantResource(tenant); // ✅ resource adapter

      decisions.push({
        userId: user._id,
        resourceId: tenant._id,
        action: "TENANT_READ",
        allowed: canReadTenant({
          user: abacUser,
          resource: abacTenant,
        }),
      });

      decisions.push({
        userId: user._id,
        resourceId: tenant._id,
        action: "TENANT_UPDATE",
        allowed: canUpdateTenant({
          user: abacUser,
          resource: abacTenant,
        }),
      });

      decisions.push({
        userId: user._id,
        resourceId: tenant._id,
        action: "TENANT_DELETE",
        allowed: canDeleteTenant({
          user: abacUser,
        }),
      });
    }
  }

  return decisions;
}

/* ------------------------------------------------------------------ */
/* ------------------------- ADAPTERS ---------------------------------*/
/* ------------------------------------------------------------------ */

/**
 * SimulationUser → AbacUser
 */
function toAbacUser(user: SimulationUser): AbacUser {
  return {
    id: user._id,
    role: user.role,
    tenantId: user.tenantId,
  };
}

/**
 * Simulation tenant → TenantResource
 */
function toTenantResource(tenant: {
  _id: string;
  tenantId: string;
  status: "ACTIVE" | "ARCHIVED";
}): TenantResource {
  return {
    tenantId: tenant.tenantId,
    status: tenant.status,
  };
}

