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


           const { rbacChange, abacChange } = req.body;

            if (!rbacChange && !abacChange) {
                   return res.status(400).json({
                 message: "Simulation change payload missing",
                 });
              }




       const result = await simulateUnifiedPolicyChange({
           tenantId,
           rbacChange,
           abacChange,
      });


    return res.status(200).json(result);
  } catch (error) {
    console.error("Policy simulation failed:", error);
    return res.status(500).json({
      message: "Policy simulation failed",
    });
  }
}
