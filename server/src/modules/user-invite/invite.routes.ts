import { Request, Router } from 'express';
import { createInvite, validateInvite, acceptInvite } from './invite.controller';
import authMiddleware from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/requirePermission';
import { Permission } from '../../constants/permissions';
import { withAudit } from '../audit/audit.middleware';

const router = Router();

// 1. Admin creates an invite (Requires Auth & USER_MANAGE privileges)
router.post('/',
    authMiddleware,
    requirePermission(Permission.USER_MANAGE),
    withAudit("Generate Invite", (req: Request) => ({ type: "USER", id: req.body?.email || "UNKNOWN" })),
    createInvite
);

// 2. Public endpoint to check if an invite token is valid and active
router.get('/validate', validateInvite);

// 3. Public endpoint to accept an invite and set a password
router.post('/accept', acceptInvite);

export default router;
