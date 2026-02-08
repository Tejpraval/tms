import { Permission } from "../../constants/permissions";
import { Role } from "../../constants/roles";
import { AbacDecisionChange } from "./engine/abac.diff";
/* ---------------- Simulation Change Types ---------------- */

export enum SimulationChangeType {
  ROLE_PERMISSION_UPDATE = "ROLE_PERMISSION_UPDATE",
}

export interface RolePermissionUpdateChange {
  type: SimulationChangeType.ROLE_PERMISSION_UPDATE;
  roleId: Role;
  permissions: Permission[];
}

export type SimulationChange = RolePermissionUpdateChange;

/* ---------------- Simulation Core Types ---------------- */

/**
 * Minimal user shape for simulation engine
 * (NO mongoose, NO documents)
 */
export interface SimulationUser {
  _id: string;
  role: Role;
  tenantId?: string;
}

export interface UserAccessSnapshot {
  userId: string;
  permissions: Set<Permission>;
}

export interface UserPermissionDiff {
  gained: Permission[];
  lost: Permission[];
}

export type BlastRadius = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface PolicySimulationResult {
  summary: {
    impactedUsers: number;
    blastRadius: BlastRadius;
  };
  diffs: Record<string, UserPermissionDiff>;
}

export type AbacAction =
  | "TENANT_READ"
  | "TENANT_UPDATE"
  | "TENANT_DELETE";

export interface AbacDecision {
  userId: string;
  resourceId: string;
  action: AbacAction;
  allowed: boolean;
}

export enum AbacSimulationChangeType {
  USER_ATTRIBUTE_UPDATE = "USER_ATTRIBUTE_UPDATE",
  RESOURCE_ATTRIBUTE_UPDATE = "RESOURCE_ATTRIBUTE_UPDATE",
  POLICY_LOGIC_UPDATE = "POLICY_LOGIC_UPDATE",
}

export interface UserAttributeUpdateChange {
  type: AbacSimulationChangeType.USER_ATTRIBUTE_UPDATE;
  userId: string;
  attributes: Partial<{
    role: string;
    tenantId: string;
  }>;
} 

export interface UnifiedSimulationResult {
  rbac?: PolicySimulationResult;
  abac?: {
    decisionChanges: AbacDecisionChange[];
  };
}

export interface UnifiedSimulationInput {
  tenantId: string;
  rbacChange?: SimulationChange;
  abacChange?: UserAttributeUpdateChange;
}
