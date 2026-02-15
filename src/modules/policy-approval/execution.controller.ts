// src/modules/policy-approval/execution.controller.ts

import { Response } from "express";
import { AuthenticatedRequest } from "../../types/authenticated-request";
import { executeApprovedPolicy } from "./execution.service";

export async function executePolicy(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { simulationId } = req.body;

    const result = await executeApprovedPolicy(simulationId);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
