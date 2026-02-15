//D:\resumeproject\server\src\modules\policy-simulation\simulation.controller.ts
import { Request, Response } from "express";
import { simulateUnifiedPolicyChange } from "./simulation.service";

import { SimulationChange } from "./simulation.types";

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




const result = await simulateUnifiedPolicyChange({
  tenantId,
  policyId,
  version,
  rbacChange,
  abacChange,
});


    return res.status(200).json(result);
  }catch (error: any) {
  console.error("🔥 SIMULATION ERROR:", error);
  return res.status(500).json({
    message: "Policy simulation failed",
    error: error?.message
  });
}

}
