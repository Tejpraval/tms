import { Request, Response } from "express";
import { resolvePolicyVersion } from "../policy-versioning/releaseRouter.service";
import { PolicyVersion } from "../policy-versioning/policyVersion.model";

export async function evaluatePolicyController(req: Request, res: Response) {
  try {
    const { tenantId, policyId, userId, action } = req.body;

    if (!tenantId || !policyId || !userId || !action) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const versionId = await resolvePolicyVersion(
      tenantId,
      policyId,
      userId
    );

    const policyVersion = await PolicyVersion.findById(versionId);

    if (!policyVersion) {
      return res.status(404).json({ message: "Policy version not found" });
    }

    let allowed = false;

    for (const rule of policyVersion.rules || []) {
      if (
        rule.effect === "allow" &&
        rule.actions?.includes(action.toLowerCase())
      ) {
        allowed = true;
        break;
      }
    }

    return res.json({
      tenantId,
      policyId,
      versionUsed: versionId,
      allowed,
    });

  } catch (error: any) {
    console.error("EVALUATION ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}

