// src/modules/policy-approval/execution.controller.ts

import { Response } from "express";
import { AuthenticatedRequest } from "../../types/authenticated-request";
import { executeApprovedPolicy } from "./execution.service";
import { PolicyApproval } from "./approval.model";

export async function executePolicy(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { simulationId, policyId, version } = req.body;

    let existingApproval;

    if (simulationId) {
      existingApproval = await PolicyApproval.findOne({ simulationId });
    } else if (policyId && version !== undefined) {
      existingApproval = await PolicyApproval.findOne({ policy: policyId, version, status: "APPROVED" });
    }
    if (!existingApproval) {
      return res.status(404).json({ message: "Approval not found" });
    }
    if (existingApproval.status !== "APPROVED") {
      return res.status(400).json({ message: `Illegal transition: Cannot execute from state ${existingApproval.status}` });
    }

    const result = await executeApprovedPolicy(existingApproval.simulationId);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function getExecutionHistory(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { policyId } = req.params;

    if (!policyId) {
      return res.status(400).json({ message: "policyId is required" });
    }

    const executions = await PolicyApproval.find({
      policy: policyId,
      executedAt: { $exists: true, $ne: null }
    })
      .sort({ executedAt: -1 })
      .select("version executedAt decidedBy riskSeverity")
      .lean();

    const formattedHistory = executions.map(exec => ({
      versionId: typeof exec.version === 'number' ? exec.version.toString() : exec.version,
      executedAt: exec.executedAt?.toISOString(),
      executedBy: exec.decidedBy || "SYSTEM",
      riskSeverity: exec.riskSeverity
    }));

    res.json(formattedHistory);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch execution history", error: err.message });
  }
}
