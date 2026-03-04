import cron from "node-cron";
import { monitorActiveRollouts } from "./rolloutMonitor.service";

export function startRolloutMonitorJob() {
    // Scans active rollouts every 2 minutes
    cron.schedule("*/2 * * * *", async () => {
        console.log("[Rollout Monitor] Scanning active rollouts for anomaly states...");
        await monitorActiveRollouts();
    });
    console.log("[Rollout Monitor] Background job initialized.");
}
