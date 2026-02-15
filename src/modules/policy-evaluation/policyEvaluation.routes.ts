//D:\resumeproject\server\src\modules\policy-evaluation
import { Router } from "express";
import { evaluatePolicyController } from "./policyEvaluation.controller";

const router = Router();

router.post("/evaluate", evaluatePolicyController);

export default router;
