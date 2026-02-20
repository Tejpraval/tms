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
import userRoutes from "./modules/user/user.routes";
import roleRoutes from "./modules/role/role.routes";

import policyVersionRoutes from "./modules/policy-versioning/policyVersion.routes";
import policyReleaseRoutes from "./modules/policy-versioning/policyRelease.routes";
import policyEvaluationRoutes from "./modules/policy-evaluation/policyEvaluation.routes";

import { errorHandler } from "./middleware/error.middleware";
import auditRoutes from "./modules/audit/audit.routes";
import { requestLogger, httpMetricsMiddleware } from "./observability";

const app = express();

/* ---------------- Observability ---------------- */
if (process.env.OBS_ENABLED === 'true') {
  app.use(requestLogger);
  app.use(httpMetricsMiddleware);
}

/* ---------------- Middleware ---------------- */

app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(helmet({
  contentSecurityPolicy: true,
  frameguard: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------- Routes ---------------- */

// Auth
app.use("/api/auth", authRoutes);
// Platform (Authority Layer)
import platformRoutes from "./routes/platform.routes";
app.use("/api/platform", platformRoutes);

// Audit
app.use("/api/audit", auditRoutes);

// Users
app.use("/api/users", userRoutes);

// Roles
app.use("/api/roles", roleRoutes);

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

/* ---------------- 404 Interceptor ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

/* ---------------- Error Handler (LAST) ---------------- */

app.use(errorHandler);

export default app;
