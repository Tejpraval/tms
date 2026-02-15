import { AbacDecision } from "../simulation.types";

/**
 * A single ABAC decision flip
 */
export interface AbacDecisionChange {
  userId: string;
  resourceId: string;
  action: string;
  from: "ALLOW" | "DENY";
  to: "ALLOW" | "DENY";
}

/**
 * Diff ABAC decisions (before vs after)
 */
export function diffAbacDecisions(
  before: AbacDecision[],
  after: AbacDecision[]
): AbacDecisionChange[] {
  const changes: AbacDecisionChange[] = [];

  // Index BEFORE decisions for fast lookup
  const beforeIndex = indexDecisions(before);

  for (const afterDecision of after) {
    const key = decisionKey(afterDecision);
    const beforeDecision = beforeIndex.get(key);

    // No before → skip (should not happen, but safe)
    if (!beforeDecision) continue;

    // Same outcome → no change
    if (beforeDecision.allowed === afterDecision.allowed) continue;

    changes.push({
      userId: afterDecision.userId,
      resourceId: afterDecision.resourceId,
      action: afterDecision.action,
      from: beforeDecision.allowed ? "ALLOW" : "DENY",
      to: afterDecision.allowed ? "ALLOW" : "DENY",
    });
  }

  return changes;
}

/* ------------------------------------------------------------------ */
/* ------------------------- INTERNALS --------------------------------*/
/* ------------------------------------------------------------------ */

/**
 * Create stable key for a decision
 */
function decisionKey(decision: AbacDecision): string {
  return [
    decision.userId,
    decision.resourceId,
    decision.action,
  ].join("|");
}

/**
 * Index decisions by stable key
 */
function indexDecisions(
  decisions: AbacDecision[]
): Map<string, AbacDecision> {
  const map = new Map<string, AbacDecision>();

  for (const decision of decisions) {
    map.set(decisionKey(decision), decision);
  }

  return map;
}
