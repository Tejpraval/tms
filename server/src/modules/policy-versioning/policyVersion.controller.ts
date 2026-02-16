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

    const versions = await PolicyVersion.find({ policyId: id })
      .sort({ version: -1 });

    res.json(versions);
  } catch (err) {
    next(err);
  }
}; 

export const listPolicies = async (req: Request, res: Response) => {
  const policies = await Policy.find().lean();

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
