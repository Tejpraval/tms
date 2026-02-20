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
    const { simulationId } = req.body;

    const existingApproval = await PolicyApproval.findOne({ simulationId });
    if (!existingApproval) {
      return res.status(404).json({ message: "Approval not found" });
    }
    if (existingApproval.status !== "APPROVED") {
      return res.status(400).json({ message: `Illegal transition: Cannot execute from state ${existingApproval.status}` });
    }

    const result = await executeApprovedPolicy(simulationId);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
