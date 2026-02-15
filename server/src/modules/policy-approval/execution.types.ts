// src/modules/policy-approval/execution.types.ts

export interface ExecutionResult {
  executed: boolean;
  executedAt?: Date;
  message: string;
}
