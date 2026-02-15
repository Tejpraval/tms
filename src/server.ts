// server.ts
import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import cron from "node-cron";
import { processActiveRollouts } from "./modules/policy-versioning/rolloutOrchestrator.service";

(async () => {
  await connectDB();

  // Autonomous rollout processor
  cron.schedule("*/1 * * * *", async () => {
    await processActiveRollouts();
  });

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT}`);
  });
})();
