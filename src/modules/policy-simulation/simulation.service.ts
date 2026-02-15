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
import { scorePolicyRisk } from "./risk/risk.scorer";
import { explainRbacDiffs } from "./explain/rbac.explainer";
import { explainAbacChanges } from "./explain/abac.explainer";
import { explainRisk } from "./explain/risk.explainer";
import { AuditStep, ExplanationItem } from "./explain/explain.types";
import { createApprovalFromSimulation } from "../policy-approval/approval.service";
import { randomUUID } from "crypto";
import { Policy } from "../policy-versioning/policy.model";
import { getPolicyVersionFromCache } from "../../utils/policyCache";
import { AbacDecision,  AbacAction } from "./simulation.types";
import { PolicyVersion } from "../policy-versioning/policyVersion.model";

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
   
  const risk = scorePolicyRisk({
  rbacDiffs: result.rbac?.diffs,
  abacChanges: result.abac?.decisionChanges,
   });

   result.risk = risk;
   
  const explanation: ExplanationItem[] = [];
const auditTrail: AuditStep[] = [];

auditTrail.push({ step: "Simulation started", at: new Date().toISOString() });

if (result.rbac) {
  explanation.push(...explainRbacDiffs(result.rbac.diffs));
  auditTrail.push({ step: "RBAC evaluated", at: new Date().toISOString() });
}

if (result.abac) {
  explanation.push(...explainAbacChanges(result.abac.decisionChanges));
  auditTrail.push({ step: "ABAC evaluated", at: new Date().toISOString() });
}

if (result.risk) {
  explanation.push(...explainRisk(result.risk.factors));
  auditTrail.push({ step: "Risk calculated", at: new Date().toISOString() });
}

result.explanation = {
  summary: `Simulation completed with ${result.risk?.severity ?? "LOW"} risk`,
  details: explanation,
  auditTrail,
};
 
 // Generate immutable simulation ID
const simulationId = randomUUID();

result.simulationId = simulationId;

// Create approval record (Phase 6.1)
if (result.risk) {
  await createApprovalFromSimulation({
  tenantId: input.tenantId,
  simulationId,
  policyId: input.policyId,
  version: input.version,
  risk: {
    score: result.risk.score,
    severity: result.risk.severity,
  },
});

}



  return result; 



}


/**
 * Simulate specific policy version
 */


export async function simulatePolicyVersion(
  policyId: string,
  tenantId: string,
  versionNumber?: number
) {
  const policy = await Policy.findOne({ policyId });

  if (!policy) {
    throw new Error("Policy not found");
  }

  let policyVersion;

  // If specific version number provided → load by version number
  if (versionNumber !== undefined) {
    policyVersion = await getPolicyVersionFromCache(
      policyId,
      versionNumber
    );
 } else {
  policyVersion = await getPolicyVersionFromCache(
    policyId,
    policy.activeVersion   // ✅ use NUMBER directly
  );
}


  if (!policyVersion) {
    throw new Error("Policy version not found");
  }

  const users = (await User.find({ tenantId }).lean()).map(u => ({
    _id: u._id.toString(),
    role: u.role,
    tenantId: u.tenantId?.toString(),
  }));

  const tenants = (await Tenant.find({ _id: tenantId }).lean()).map(t => ({
    _id: t._id.toString(),
    tenantId: t._id.toString(),
    status: (t.isDeleted ? "ARCHIVED" : "ACTIVE") as "ACTIVE" | "ARCHIVED",
  }));

  const baseline = runAbacSimulation({
    users,
    tenants,
    change: undefined as any
  });

  const before = baseline.before;

  const after = evaluateAbacRulesDirectly(
    users,
    tenants,
    policyVersion.rules
  );

  return {
    policyId,
    version: versionNumber ?? "active",
    result: diffAbacDecisions(before, after)
  };
}



function evaluateAbacRulesDirectly(
  users: any[],
  tenants: any[],
  rules: any[]
): AbacDecision[] {

  const decisions: AbacDecision[] = [];

  for (const user of users) {
    for (const resource of tenants) {

      let allowed = false;

      for (const rule of rules) {
        if (rule.effect !== "allow") continue;
        if (rule.actions?.includes("read")) {
          allowed = true;
        }
      }

      decisions.push({
        userId: user._id,
        resourceId: resource._id,
        action: "READ" as AbacAction,
        allowed
      });
    }
  }

  return decisions;
}



