import { useMemo } from "react";
import type { Approval } from "../types";
import {
  calculateApprovalSlaMetrics,
  type ApprovalSlaMetrics,
} from "../sla.utils";

export const useApprovalSlaIntelligence = (
  approvals: Approval[]
): ApprovalSlaMetrics => {
  return useMemo(() => {
    return calculateApprovalSlaMetrics(approvals);
  }, [approvals]);
};
