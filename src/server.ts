import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";

import policySimulationRoutes from "./modules/policy-simulation/simulation.routes";
import policyApprovalRoutes from "./modules/policy-approval/approval.routes";

// 🔹 Policy Simulation (RBAC + ABAC)
app.use("/api/policies", policySimulationRoutes);

// 🔹 Policy Approval Workflow
app.use("/api/policy-approval", policyApprovalRoutes);

(async () => {
  await connectDB();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
})();
