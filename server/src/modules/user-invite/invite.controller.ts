import { Request, Response } from 'express';
import { createInviteProcess, validateInviteTokenProcess, acceptInviteProcess } from './invite.service';
import bcrypt from 'bcrypt';

// POST /invites
export const createInvite = async (req: Request, res: Response) => {
    try {
        const { email, roleId, staticRole } = req.body;
        const tenantId = req.user?.tenantId;
        const createdBy = req.user?.id;

        if (!tenantId || !createdBy) {
            return res.status(401).json({ message: "Unauthorized. Tenant context missing." });
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        const { rawToken, inviteId } = await createInviteProcess(email, tenantId, createdBy, roleId, staticRole);

        res.status(201).json({
            success: true,
            message: "Invite generated securely.",
            data: {
                inviteId,
                // In a real app, send this via AWS SES or SendGrid.
                // For this project, we return it so the Frontend Admin can copy it for testing.
                mockEmailLink: `http://localhost:5173/accept-invite?token=${rawToken}`
            }
        });
    } catch (err: any) {
        if (err.message.includes("An active pending invite already exists")) {
            return res.status(409).json({ success: false, message: err.message });
        }
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /invites/validate?token=XYZ
export const validateInvite = async (req: Request, res: Response) => {
    try {
        const token = req.query.token as string;
        if (!token) return res.status(400).json({ message: "Token is required." });

        const invite = await validateInviteTokenProcess(token);

        // Don't leak too much data, just confirm validity and email
        res.json({
            success: true,
            data: {
                email: invite.email
            }
        });
    } catch (err: any) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// POST /invites/accept
export const acceptInvite = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required." });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }

        // Hash the new password before passing to the atomic acceptance flow
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await acceptInviteProcess(token, hashedPassword);

        res.status(201).json({
            success: true,
            message: "Invite accepted and user created successfully.",
            data: {
                userId: user._id,
                email: user.email
            }
        });
    } catch (err: any) {
        if (err.message.includes("Email Collision") || err.message.includes("A user with this email address already exists")) {
            return res.status(409).json({ success: false, message: err.message });
        }
        res.status(400).json({ success: false, message: err.message });
    }
};
