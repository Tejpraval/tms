import { Request, Response } from "express";
import { Tenant } from "../tenant/tenant.model";
import { Policy } from "../policy-versioning/policy.model";
import { PolicyApproval } from "../policy-approval/approval.model";

export const getGovernanceOverview = async (req: Request, res: Response) => {
    try {
        // We aggregate across ALL policies logically grouped by tenantId
        // Then we can aggregate pending approvals natively without strictly locking models.

        const aggregatedMetrics = await Policy.aggregate([
            {
                $lookup: {
                    from: 'policyapprovals', // Collection name for approvals
                    localField: '_id',
                    foreignField: 'policy',
                    as: 'approvals'
                }
            },
            {
                $group: {
                    _id: "$tenantId",
                    totalPolicies: { $sum: 1 },
                    // Count how many approvals across all policies for this tenant currently have status PENDING
                    pendingApprovals: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: "$approvals",
                                    as: "approval",
                                    cond: { $eq: ["$$approval.status", "PENDING"] }
                                }
                            }
                        }
                    },
                    highRiskApprovals: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: "$approvals",
                                    as: "approval",
                                    cond: {
                                        $and: [
                                            { $eq: ["$$approval.status", "PENDING"] },
                                            {
                                                $or: [
                                                    { $eq: ["$$approval.riskSeverity", "HIGH"] },
                                                    { $eq: ["$$approval.riskSeverity", "CRITICAL"] }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $sort: { totalPolicies: -1 }
            }
        ]).option({ maxTimeMS: 5000 });

        const mappedData = aggregatedMetrics.map((item: any) => ({
            tenantId: item._id?.toString() || "Unknown",
            totalPolicies: item.totalPolicies || 0,
            pendingApprovals: item.pendingApprovals || 0,
            highRiskApprovals: item.highRiskApprovals || 0
        }));

        res.status(200).json({
            success: true,
            data: mappedData
        });
    } catch (error) {
        console.error("Super Admin Analytics Error:", error);
        res.status(500).json({
            success: false,
            error: "Super Admin dashboard metrics unavailable",
            metrics: null
        });
    }
};
