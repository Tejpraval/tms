import { Router } from 'express';
import { getRoles, createRole, updateRolePermissions, deleteRole } from './role.controller';
import { requirePermission } from '../../middleware/requirePermission';
import authMiddleware from '../../middleware/auth.middleware';
import { Permission } from '../../constants/permissions';

const router = Router();

router.use(authMiddleware);
router.use(requirePermission(Permission.USER_MANAGE));

router.get('/', getRoles);
router.post('/', createRole);
router.patch('/:id/permissions', updateRolePermissions);
router.delete('/:id', deleteRole);

export default router;
