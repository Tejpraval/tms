import { Request, Response } from "express";
import { PolicyRelease } from "./policyRelease.model";
import {
  expandRollout,
  rollbackRelease,
} from "./policyRelease.service";
import { Policy } from "./policy.model";

export async function createRelease(req: Request, res: Response) {
  const {
    tenantId,
    policyId,
    baseVersionId,
    candidateVersionId,
    rolloutPercentage,
  } = req.body;

  const release = await PolicyRelease.create({
    tenantId,
    policyId,
    baseVersionId,
    candidateVersionId,
    rolloutPercentage,
    status: "ACTIVE",
    expansionHistory: [],
  });

await Policy.findOneAndUpdate(
  { policyId },   // ✅ use business id
  {
    releaseMode: "ROLLOUT",
    releaseId: release._id,
  }
);




  res.status(201).json(release);
}

export async function expandRelease(req: Request, res: Response) {
  const { newPercentage } = req.body;

  const releaseId = req.params.id as string;

  const release = await expandRollout(releaseId, newPercentage);


  res.json(release);
}

export async function rollbackReleaseHandler(req: Request, res: Response) {
  const releaseId = req.params.id as string;

const release = await rollbackRelease(releaseId);

  res.json(release);
}
