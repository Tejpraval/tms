import crypto from 'crypto';
import { Invite, IInvite } from './invite.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';

/**
 * Generates a high-entropy secure raw token and its deterministic SHA-256 hash.
 * The raw token is distributed to the user. The hashed token is stored in the DB.
 */
function generateSecureToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    return { rawToken, hashedToken };
}

export const createInviteProcess = async (
    email: string,
    tenantId: string,
    createdBy: string,
    roleId?: string,
    staticRole?: string
) => {
    // 1. Guard against creating duplicate active invites for the same user
    const existingActiveInvite = await Invite.findOne({
        email,
        tenantId,
        status: "PENDING",
        expiresAt: { $gt: new Date() } // Actually still active
    });

    if (existingActiveInvite) {
        throw new Error("An active pending invite already exists for this email.");
    }

    // 2. Generate secure tokens
    const { rawToken, hashedToken } = generateSecureToken();

    // 3. Set expiration (48 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // 4. Persist Invite with Hashed Token
    const invite = await Invite.create({
        email,
        tenantId,
        roleId,
        staticRole,
        hashedToken,
        expiresAt,
        status: "PENDING",
        createdBy
    });

    // 5. Return RAW token to the caller (so it can be emailed)
    // The raw token is NEVER stored.
    return { inviteId: invite._id, rawToken };
};

export const validateInviteTokenProcess = async (rawToken: string): Promise<IInvite> => {
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const invite = await Invite.findOne({ hashedToken });

    if (!invite) {
        throw new Error("Invalid invite token.");
    }

    if (invite.status !== "PENDING") {
        throw new Error(`Invite is already ${invite.status.toLowerCase()}.`);
    }

    if (invite.expiresAt < new Date()) {
        // Opportunistically mark as expired if we caught it before TTL cleaned it
        await Invite.updateOne({ _id: invite._id }, { status: "EXPIRED" });
        throw new Error("Invite token has expired.");
    }

    return invite;
};

export const acceptInviteProcess = async (rawToken: string, newPasswordHash: string) => {
    // Note: To conform to your architecture, User creation expects a hashed password.
    // The controller should hash the incoming plaintext password using bcrypt before passing it here,
    // OR we can do it here. If `newPasswordHash` implies it's already hashed, we proceed.

    // 1. Generate lookup hash
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // 2. Fetch the invite to inspect email and tenant (validation check without mutation first)
    //    We don't purely rely on this for atomicity, but we need the data.
    const inviteData = await Invite.findOne({ hashedToken, status: 'PENDING' });
    if (!inviteData) {
        throw new Error("Invalid, used, or expired invite token.");
    }

    if (inviteData.expiresAt < new Date()) {
        await Invite.updateOne({ _id: inviteData._id }, { status: 'EXPIRED' });
        throw new Error("Invite token has expired.");
    }

    // 3. Email Collision Guard
    // Ensure no User currently occupies this email address BEFORE we try to claim the invite
    const existingUser = await User.findOne({ email: inviteData.email });
    if (existingUser) {
        // Abort flow and actively kill the invite
        await Invite.updateOne({ _id: inviteData._id }, { status: 'EXPIRED' });
        throw new Error("A user with this email address already exists. Invite invalidated.");
    }

    // 4. Atomic Acceptance (Race Condition Guard)
    //    Attempt to transition PENDING -> ACCEPTED. If multiple threads hit this,
    //    only one will return a document.
    const acceptedInvite = await Invite.findOneAndUpdate(
        { _id: inviteData._id, status: 'PENDING' },
        { status: 'ACCEPTED' },
        { new: true } // Returns the modified doc
    );

    if (!acceptedInvite) {
        throw new Error("Failed to claim invite. It may have just been used by another process.");
    }

    // 5. Create the actual User record
    const newUser = await User.create({
        email: acceptedInvite.email,
        password: newPasswordHash,
        tenantId: acceptedInvite.tenantId,
        customRoleId: acceptedInvite.roleId,
        role: acceptedInvite.staticRole || 'TENANT', // Use explicit native role, or fallback to standard TENANT
    });

    return newUser;
};
