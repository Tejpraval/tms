// server.ts
import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import cron from "node-cron";
import { processActiveRollouts } from "./modules/policy-versioning/rolloutOrchestrator.service";
import { startRolloutMonitorJob } from "./modules/rollout-monitor/rolloutMonitor.job";
import { seedDevData } from "./seed/devSeed";

(async () => {
  await connectDB();

  if (!ENV.JWT_ACCESS_SECRET) {
    console.error("FATAL: JWT_ACCESS_SECRET is undefined. Exiting.");
    process.exit(1);
  }

  if (process.env.NODE_ENV === "development") {
    await seedDevData();
  }

  // Autonomous rollout processor
  cron.schedule("*/1 * * * *", async () => {
    await processActiveRollouts();
  });

  // Rollout Anomaly & Failure Monitor
  startRolloutMonitorJob();

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
})();
