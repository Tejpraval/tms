//D:\resumeproject\server\src\modules\policy-versioning\policyVersion.controller.ts
import { Request, Response, NextFunction } from "express";
import {
  createDraftVersion,
  activateVersion,
  rollbackPolicy,
} from "./policyVersion.service";
import { compareVersions } from "../policy-simulation/engine/diff.engine";
import { PolicyVersion } from "./policyVersion.model";
import { Policy } from "./policy.model";
import { generateChecksum } from "../../utils/checksum";
// -----------------------------
// Create Root Policy
// -----------------------------
export const createPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, policyId, rules, tags } = req.body;
    const userReq = req as any; // Using explicit cast mapping underlying Authenticated headers

    if (!name || !policyId || !rules) {
      return res.status(400).json({ success: false, message: "Missing required fields: name, policyId, rules" });
    }

    const policy = new Policy({
      name,
      policyId,
      tenantId: userReq.user?.tenantId,
      activeVersion: undefined,
      latestVersion: 1,
      tags: tags || []
    });
    await policy.save();

    const version = new PolicyVersion({
      policy: policy._id,
      version: 1,
      status: "draft",
      rules,
      checksum: generateChecksum(rules),
      createdBy: userReq.user?.id
    });
    await version.save();

    res.status(201).json({
      success: true,
      data: {
        policy,
        version
      }
    });
  } catch (err) {
    next(err);
  }
};

// -----------------------------
// Create Draft
// -----------------------------
export const createDraft = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      throw new Error("Invalid policy id");
    }

    const policyId: string = idParam;

    const { rules } = req.body;

    const userId = (req as any).user?.id;

    const version = await createDraftVersion(
      policyId,
      rules,
      userId
    );

    res.status(201).json(version);

  } catch (err) {
    next(err);
  }
};


// -----------------------------
// Activate Version
// -----------------------------
export const activate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
      throw new Error("Invalid policy id");
    }
    const policyId = idParam;
    const { version } = req.params;
    const userId = (req as any).user?.id;

    const result = await activateVersion(policyId, Number(version), userId);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// -----------------------------
// Rollback
// -----------------------------
export const rollback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      throw new Error("Invalid policy id");
    }

    const policyId = idParam;
    const { version } = req.params;
    const userId = (req as any).user?.id;

    const versionDoc = await PolicyVersion.findOne({ policy: policyId, version: Number(version) });
    if (!versionDoc) {
      return res.status(404).json({ message: "Policy version not found" });
    }
    if (versionDoc.status !== "active") {
      return res.status(400).json({ message: `Illegal transition: Cannot rollback from state ${versionDoc.status.toUpperCase()}` });
    }

    versionDoc.status = "rolled_back";
    await versionDoc.save();

    const result = await rollbackPolicy(policyId, Number(version), userId);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// -----------------------------
// Compare Versions
// -----------------------------
export const compare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const idParam = req.params.id;

    if (!idParam || Array.isArray(idParam)) {
      throw new Error("Invalid policy id");
    }

    const policyId = idParam;
    const { v1, v2 } = req.query;

    const result = await compareVersions(
      policyId,
      Number(v1),
      Number(v2)
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// -----------------------------
// List Versions
// -----------------------------
export const listVersions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const versions = await PolicyVersion.find({ policy: id })
      .sort({ version: -1 });

    res.json(versions);
  } catch (err) {
    next(err);
  }
};

import { AuthenticatedRequest } from "../../types/authenticated-request";

export const listPolicies = async (req: Request, res: Response) => {
  const userReq = req as AuthenticatedRequest;
  const policies = await Policy.find({ tenantId: userReq.user?.tenantId }).lean();

  res.json({
    success: true,
    data: policies,
  });
};

export const getPolicyById = async (req: Request, res: Response) => {
  const policy = await Policy.findById(req.params.id).lean();

  if (!policy) {
    return res.status(404).json({
      success: false,
      message: "Policy not found",
    });
  }

  res.json({
    success: true,
    data: policy,
  });
};
