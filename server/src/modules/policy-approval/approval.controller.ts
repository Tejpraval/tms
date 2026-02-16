//D:\resumeproject\server\src\modules\policy-approval\approval.controller.ts
import { RequestHandler, Response } from "express";
import { AuthenticatedRequest } from "../../types/authenticated-request";
import { decideApproval } from "./approval.service";
import { Role } from "../../constants/roles";
import { ApprovalActorRole } from "./approval.types";
import { PolicyApproval } from "./approval.model";

function mapRoleToApprovalActor(role: Role): ApprovalActorRole {
  switch (role) {
    case Role.SUPER_ADMIN:
      return "SUPER_ADMIN";
    case Role.ADMIN:
      return "ADMIN";
    case Role.MANAGER:
      return "MANAGER";
    default:
      throw new Error("User not allowed to approve simulations");
  }
}

export async function approveSimulation(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { simulationId, comment } = req.body;

    const approval = await decideApproval({
      simulationId,
      actorRole: mapRoleToApprovalActor(req.user.role),
      decision: "APPROVE",
      comment,
    });

    res.json(approval);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function rejectSimulation(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { simulationId, comment } = req.body;

    const approval = await decideApproval({
      simulationId,
      actorRole: mapRoleToApprovalActor(req.user.role),
      decision: "REJECT",
      comment,
    });

    res.json(approval);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}


export const listPendingApprovals: RequestHandler = async (
  req,
  res
) => {
  try {
    const approvals = await PolicyApproval.find({
      status: "PENDING",
    }).lean();

    res.json({
      success: true,
      data: approvals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending approvals",
    });
  }
};
