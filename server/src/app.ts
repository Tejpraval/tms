// app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import tenantRoutes from "./modules/tenant/tenant.routes";

import policySimulationRoutes from "./modules/policy-simulation/simulation.routes";
import approvalRoutes from "./modules/policy-approval/approval.routes";
import executionRoutes from "./modules/policy-approval/execution.routes";

import policyVersionRoutes from "./modules/policy-versioning/policyVersion.routes";
import policyReleaseRoutes from "./modules/policy-versioning/policyRelease.routes";
import policyEvaluationRoutes from "./modules/policy-evaluation/policyEvaluation.routes";

import { errorHandler } from "./middleware/error.middleware";
import auditRoutes from "./modules/audit/audit.routes";
const app = express();

/* ---------------- Middleware ---------------- */

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

/* ---------------- Routes ---------------- */

// Auth
app.use("/api/auth", authRoutes);
// Audit
app.use("/api/audit", auditRoutes);

// Tenant
app.use("/api/tenant", tenantRoutes);

// Policy Evaluation
app.use("/api/policy", policyEvaluationRoutes);

// Simulation
app.use("/api/policies", policySimulationRoutes);

// Approval
app.use("/api/policy-approval", approvalRoutes);

// Execution
app.use("/api/policy-execution", executionRoutes);

// Versioning
app.use("/api/policies", policyVersionRoutes);

// Release
app.use("/api/policy-release", policyReleaseRoutes);

/* ---------------- Error Handler (LAST) ---------------- */

app.use(errorHandler);

export default app;
