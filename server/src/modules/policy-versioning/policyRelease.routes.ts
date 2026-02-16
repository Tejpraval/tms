//D:\resumeproject\server\src\modules\policy-versioning\policyRelease.routes.ts
import { Router } from "express";
import {
  createRelease,
  expandRelease,
  rollbackReleaseHandler,
  updateReleaseStatus,
} from "./policyRelease.controller";
import { listActiveReleases } from "./policyRelease.controller";
import { getReleaseByPolicy } from "./policyRelease.controller";
const router = Router();

router.post("/", createRelease);
router.post("/:id/expand", expandRelease);
router.post("/:id/rollback", rollbackReleaseHandler);
router.get("/active", listActiveReleases); 
router.get(
  "/policy/:policyId",
  getReleaseByPolicy
);
router.post("/:id/status", updateReleaseStatus);

export default router;
