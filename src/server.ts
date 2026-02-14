import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";

import policySimulationRoutes from "./modules/policy-simulation/simulation.routes";
import policyApprovalRoutes from "./modules/policy-approval/approval.routes";
import executionRoutes from "./modules/policy-approval/execution.routes";
import cron from "node-cron";
import { processActiveRollouts } from "./modules/policy-versioning/rolloutOrchestrator.service";
// 🔹 Policy Simulation (RBAC + ABAC)
app.use("/api/policies", policySimulationRoutes);

// 🔹 Policy Approval Workflow
app.use("/api/policy-approval", policyApprovalRoutes);
app.use("/api/policy-execution", executionRoutes);

(async () => {
  await connectDB();
  cron.schedule("*/1 * * * *", async () => {
  await processActiveRollouts();
});
  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
})();
