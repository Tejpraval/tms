//D:\resumeproject\server\src\modules\audit\audit.routes.ts
import { Router } from "express";
import { listRecentAudit } from "./audit.controller";

const router = Router();

router.get("/recent", listRecentAudit);

export default router;
