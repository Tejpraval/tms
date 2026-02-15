//D:\resumeproject\server\src\modules\policy-versioning\policyRelease.routes.ts
import { Router } from "express";
import {
  createRelease,
  expandRelease,
  rollbackReleaseHandler,
} from "./policyRelease.controller";

const router = Router();

router.post("/", createRelease);
router.post("/:id/expand", expandRelease);
router.post("/:id/rollback", rollbackReleaseHandler);

export default router;
