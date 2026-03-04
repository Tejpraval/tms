import { Router } from 'express';
import { getRoles, createRole, updateRolePermissions, deleteRole } from './role.controller';
import { requirePermission } from '../../middleware/requirePermission';
import authMiddleware from '../../middleware/auth.middleware';
import { Permission } from '../../constants/permissions';
import { withAudit } from '../audit/audit.middleware';

const router = Router();

router.use(authMiddleware);
router.use(requirePermission(Permission.USER_MANAGE));

router.get('/', getRoles);
router.post('/', withAudit("Create Role", (req) => ({ type: "ROLE", id: req.body?.name || "UNKNOWN" })), createRole);
router.patch('/:id/permissions', updateRolePermissions);
router.delete('/:id', deleteRole);

export default router;
