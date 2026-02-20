//D:\resumeproject\server\src\modules\policy-simulation\simulation.controller.ts
import { Request, Response } from "express";
import { simulateUnifiedPolicyChange } from "./simulation.service";

import { SimulationChange } from "./simulation.types";
import { PolicyVersion } from "../policy-versioning/policyVersion.model";
import { PolicyApproval } from "../policy-approval/approval.model";

/**
 * POST /policies/simulate
 */
export async function simulatePolicyController(
  req: Request,
  res: Response
) {
  try {
    const change = req.body.change as SimulationChange;

    const tenantId =
      req.body.tenantId ||
      req.user?.tenantId ||
      req.params.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant context missing" });
    }


    const { policyId, version, rbacChange, abacChange } = req.body;

    if (!policyId || version === undefined) {
      return res.status(400).json({
        message: "policyId and version are required for simulation",
      });
    }

    const policyVersion = await PolicyVersion.findOne({ policy: policyId, version });
    if (!policyVersion) {
      return res.status(404).json({ message: "Policy version not found" });
    }
    if (policyVersion.status !== "draft") {
      return res.status(400).json({ message: `Illegal transition: Cannot submit for approval from state ${policyVersion.status.toUpperCase()}` });
    }


    const result = await simulateUnifiedPolicyChange({
      tenantId,
      policyId,
      version,
      rbacChange,
      abacChange,
    });

    policyVersion.status = "pending_approval";
    await policyVersion.save();

    const userReq = req as any;

    await PolicyApproval.create({
      tenantId,
      simulationId: result.simulationId,
      policy: policyId,
      version: version,
      status: "PENDING",
      requestedBy: userReq.user?.id,
      riskScore: result.risk?.score || 0,
      riskSeverity: result.risk?.severity || "LOW"
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("🔥 SIMULATION ERROR:", error);
    return res.status(500).json({
      message: "Policy simulation failed",
      error: error?.message
    });
  }

}
