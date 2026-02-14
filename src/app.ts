import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import authRoutes from './modules/auth/auth.routes';
import tenantRoutes from './modules/tenant/tenant.routes';
import { errorHandler } from './middleware/error.middleware';
import policySimulationRoutes from "./modules/policy-simulation/simulation.routes";

import approvalRoutes from "./modules/policy-approval/approval.routes";

import policyVersionRoutes from "./modules/policy-versioning/policyVersion.routes";
import policyReleaseRoutes from "./modules/policy-versioning/policyRelease.routes";
import policyEvaluationRoutes from "./modules/policy-evaluation/policyEvaluation.routes";


const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes (only once)
app.use('/api/auth', authRoutes);
app.use('/api/tenant', tenantRoutes);
app.use("/api/policy", policyEvaluationRoutes);

// 👇 MUST be last
app.use(errorHandler);
app.use("/policies", policySimulationRoutes);
app.use("/policy-approvals", approvalRoutes);

app.use("/api/policies", policyVersionRoutes);
app.use("/api/policy-release", policyReleaseRoutes);

export default app;
