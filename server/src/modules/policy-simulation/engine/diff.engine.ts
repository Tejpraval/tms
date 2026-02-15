// src/modules/policy-simulation/engine/diff.engine.ts

import { Permission } from "../../../constants/permissions";
import {
  PolicySimulationResult,
  UserAccessSnapshot,
  UserPermissionDiff,
} from "../simulation.types";

import { calculateBlastRadius } from "./blastRadius";
import { PolicyVersion } from "../../policy-versioning/policyVersion.model";

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




// -----------------------------
// Rule Diff Types
// -----------------------------

export interface RuleDiff {
  added: any[];
  removed: any[];
  modified: {
    before: any;
    after: any;
  }[];
}

// -----------------------------
// Deep equality check
// -----------------------------

function isEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// -----------------------------
// Core Rule Diff Logic
// -----------------------------

export function computeDiff(
  beforeRules: any[],
  afterRules: any[]
): RuleDiff {

  const added: any[] = [];
  const removed: any[] = [];
  const modified: { before: any; after: any }[] = [];

  const beforeMap = new Map<string, any>();
  const afterMap = new Map<string, any>();

  // Index rules by ID
  for (const rule of beforeRules) {
    beforeMap.set(rule.id, rule);
  }

  for (const rule of afterRules) {
    afterMap.set(rule.id, rule);
  }

  // Detect removed + modified
  for (const [id, beforeRule] of beforeMap.entries()) {
    const afterRule = afterMap.get(id);

    if (!afterRule) {
      removed.push(beforeRule);
    } else if (!isEqual(beforeRule, afterRule)) {
      modified.push({
        before: beforeRule,
        after: afterRule
      });
    }
  }

  // Detect added
  for (const [id, afterRule] of afterMap.entries()) {
    if (!beforeMap.has(id)) {
      added.push(afterRule);
    }
  }

  return {
    added,
    removed,
    modified
  };
}


export const compareVersions = async (
  policyId: string,
  v1: number,
  v2: number
) => {
  const version1 = await PolicyVersion.findOne({ policyId, version: v1 });
  const version2 = await PolicyVersion.findOne({ policyId, version: v2 });

  if (!version1 || !version2) {
    throw new Error("One or both policy versions not found");
  }

  return computeDiff(version1.rules, version2.rules);
};

