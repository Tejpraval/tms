import { RequestHandler } from "express";
import { PolicyRelease } from "./policyRelease.model";
import {
  expandRollout,
  rollbackRelease,
} from "./policyRelease.service";
import { Policy } from "./policy.model";

/* ------------------------------------------
   Create Release
------------------------------------------- */

export const createRelease: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
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
      { policyId },
      {
        releaseMode: "ROLLOUT",
        releaseId: release._id,
      }
    );

    res.status(201).json({
      success: true,
      data: release,
    });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------
   Expand Release
------------------------------------------- */

export const expandRelease: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { newPercentage } = req.body;
    const releaseId = req.params.id;

    const release = await expandRollout(
      releaseId as string,
      newPercentage
    );

    res.json({
      success: true,
      data: release,
    });
  } catch (err) {
    next(err);
  }
};

/* ------------------------------------------
   Rollback Release
------------------------------------------- */

export const rollbackReleaseHandler: RequestHandler =
  async (req, res, next) => {
    try {
      const releaseId = req.params.id as string;

      const release = await rollbackRelease(releaseId);

      res.json({
        success: true,
        data: release,
      });
    } catch (err) {
      next(err);
    }
  };

/* ------------------------------------------
   List Active Releases
------------------------------------------- */

export const listActiveReleases: RequestHandler =
  async (req, res, next) => {
    try {
      const releases = await PolicyRelease.find({
        status: "ACTIVE",
      }).lean();

      res.json({
        success: true,
        data: releases,
      });
    } catch (err) {
      next(err);
    }
  };
