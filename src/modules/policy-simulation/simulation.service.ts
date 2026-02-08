//D:\resumeproject\server\src\modules\policy-simulation\simulation.service.ts
import { runPolicySimulation } from "./engine/simulator";
import { diffAccessSnapshots } from "./engine/diff.engine";

// ⬆️ this is your EXISTING RBAC logic (unchanged)

import { runAbacSimulation } from "./engine/abac.simulator";
import { diffAbacDecisions } from "./engine/abac.diff";

import {
  UnifiedSimulationInput,
  UnifiedSimulationResult,
} from "./simulation.types";

import { User } from "../user/user.model";
import { Tenant } from "../tenant/tenant.model";

/**
 * Unified policy simulation (RBAC + ABAC)
 */
export async function simulateUnifiedPolicyChange(
  input: UnifiedSimulationInput
): Promise<UnifiedSimulationResult> {
  const result: UnifiedSimulationResult = {};

  /* ---------------- RBAC SIMULATION ---------------- */
/* ---------------- RBAC SIMULATION ---------------- */


/* ---------------- RBAC SIMULATION ---------------- */
if (input.rbacChange) {
  const rbacUsers = (await User.find({ tenantId: input.tenantId }).lean()).map(
    u => ({
      _id: u._id.toString(),
      role: u.role,
      tenantId: u.tenantId?.toString(),
    })
  );

  const { before, after } = await runPolicySimulation({
    tenantId: input.tenantId,
    users: rbacUsers,
    change: input.rbacChange,
  });

result.rbac = diffAccessSnapshots(before, after);

}



  /* ---------------- ABAC SIMULATION ---------------- */
  if (input.abacChange) {
    // Load users
    const users = (await User.find({ tenantId: input.tenantId }).lean()).map(
      u => ({
        _id: u._id.toString(),
        role: u.role,
        tenantId: u.tenantId?.toString(),
      })
    );

    // Load tenants (resources)
  const tenants = (await Tenant.find({ _id: input.tenantId }).lean()).map(
    t => ({
      _id: t._id.toString(),
      tenantId: t._id.toString(),
      status: (t.isDeleted ? "ARCHIVED" : "ACTIVE") as "ACTIVE" | "ARCHIVED",
    })
  );


    const { before, after } = runAbacSimulation({
      users,
      tenants,
      change: input.abacChange,
    });

    result.abac = {
      decisionChanges: diffAbacDecisions(before, after),
    };
  }

  return result;
}
