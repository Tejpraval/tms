import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { register } from "../observability";

const router = Router();

// 🔒 Role Guard
const requireSuperAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== "SUPER_ADMIN") {
        return res.status(403).json({ message: "Platform access denied" });
    }
    next();
};

router.use(authMiddleware, requireSuperAdmin);

router.get("/metrics", async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

router.get("/intelligence-summary", async (req, res) => {
    // 1. Get raw metrics from register
    const rawMetrics = await register.getMetricsAsJSON();

    // 2. Initialize aggregators
    let simulationsTotal = 0;
    let rolloutFailures = 0;
    const approvals = { approved: 0, rejected: 0, escalated: 0 };
    const riskLevels = { low: 0, medium: 0, high: 0, critical: 0 };

    // 3. Process metrics
    for (const metric of rawMetrics) {

        // Policy Simulations
        if (metric.name === 'policy_simulation_total') {
            simulationsTotal = (metric as any).values.reduce((sum: number, val: any) => sum + val.value, 0);
        }

        // Rollout Failures
        if (metric.name === 'rollout_failure_total') {
            rolloutFailures = (metric as any).values.reduce((sum: number, val: any) => sum + val.value, 0);
        }

        // Approval Decisions
        if (metric.name === 'approval_decisions_total') {
            (metric as any).values.forEach((val: any) => {
                if (val.labels.decision === 'approved') approvals.approved += val.value;
                if (val.labels.decision === 'rejected') approvals.rejected += val.value;
                if (val.labels.decision === 'escalated') approvals.escalated += val.value;
            });
        }

        // Risk Distribution (Buckets)
        if (metric.name === 'risk_score_distribution') {
            // Histogram processing is complex in JSON; simplifying for summary
            // Aggregating counts from buckets if needed, or just skipping detailed histograms for this high-level view
            // For now, let's just infer from the count if available or skip
        }
    }

    // 4. Return Summary
    res.json({
        governance: {
            simulations: {
                total: simulationsTotal,
                latencyP95: 0.15 // Placeholder until histogram math added
            },
            approvals,
            rollouts: {
                active: 12, // Placeholder - requires Gauge lookup
                failures: rolloutFailures
            },
            risk: riskLevels // Placeholder
        },
        observabilityStatus: process.env.OBS_ENABLED === 'true' ? 'active' : 'disabled'
    });
});

router.get("/overview", (req, res) => {
    // Return structured JSON as requested
    res.json({
        platform: {
            status: "healthy",
            totalTenants: 12,
            activeRollouts: 45,
            complianceScore: 88
        },
        activityStream: [
            { id: 1, type: "DEPLOY", tenant: "Acme Corp", policy: "POL-121", time: new Date().toISOString() },
            { id: 2, type: "VIOLATION", tenant: "Globex", policy: "POL-99", time: new Date().toISOString() }
        ]
    });
});

export default router;
