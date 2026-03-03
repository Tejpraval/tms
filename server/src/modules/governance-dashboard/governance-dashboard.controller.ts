import { Request, Response } from "express";
import { PolicyVersion } from "../policy-versioning/policyVersion.model";
import { PolicyApproval } from "../policy-approval/approval.model";
import mongoose from "mongoose";

export const getGovernanceAnalytics = async (req: Request, res: Response) => {
    try {
        const tenantId = (req as any).user!.tenantId;

        // 30-day window
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // 1. Policy Change Velocity (Versions created last 30 days)
        const velocityAggregate = await PolicyVersion.aggregate([
            {
                $match: {
                    tenantId: new mongoose.Types.ObjectId(tenantId),
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $count: "created"
            }
        ]).option({ maxTimeMS: 5000 });

        const policyChangeVelocity = velocityAggregate.length > 0 ? velocityAggregate[0].created : 0;

        // 2. Approval SLA Breach Count (> 48h to approve)
        const slaBreachAggregate = await PolicyApproval.aggregate([
            {
                $match: {
                    tenantId: new mongoose.Types.ObjectId(tenantId),
                    status: 'APPROVED',
                    $expr: {
                        $gt: [
                            { $subtract: ["$decidedAt", "$createdAt"] },
                            48 * 60 * 60 * 1000 // 48 hours in milliseconds
                        ]
                    }
                }
            },
            {
                $count: "breaches"
            }
        ]).option({ maxTimeMS: 5000 });

        const approvalSlaBreaches = slaBreachAggregate.length > 0 ? slaBreachAggregate[0].breaches : 0;

        // 3. Risk Trend (last 30 days grouped by day)
        // We look at UnifiedSimulationResults mapped inside PolicyVersion where riskScore exists
        const riskTrendAggregate = await PolicyVersion.aggregate([
            {
                $match: {
                    tenantId: new mongoose.Types.ObjectId(tenantId),
                    createdAt: { $gte: thirtyDaysAgo },
                    "simulationResult.riskScore": { $exists: true }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    averageRisk: { $avg: "$simulationResult.riskScore" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]).option({ maxTimeMS: 5000 });

        // Map and structure the response
        const mappedRiskTrends = riskTrendAggregate.map((row: any) => ({
            date: row._id,
            avgRisk: row.averageRisk || 0
        }));

        res.status(200).json({
            success: true,
            data: {
                policyChangeVelocity,
                approvalSlaBreaches,
                riskTrend: mappedRiskTrends
            }
        });
    } catch (error) {
        console.error("Dashboard Analytics Error:", error);
        res.status(500).json({
            success: false,
            error: "Dashboard metrics unavailable",
            metrics: null
        });
    }
};
