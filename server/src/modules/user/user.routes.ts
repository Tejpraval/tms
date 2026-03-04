import { Router } from 'express';
import { getUsers, createUser, updateUserRole, deleteUser } from './user.controller';
import { requirePermission } from '../../middleware/requirePermission';
import authMiddleware from '../../middleware/auth.middleware';
import { Permission } from '../../constants/permissions';
import { withAudit } from '../audit/audit.middleware';

const router = Router();

// ALL operations require authentication and USER_MANAGE permission
router.use(authMiddleware);
router.use(requirePermission(Permission.USER_MANAGE));

router.get('/', getUsers);
router.post('/', withAudit("Create User", (req) => ({ type: "USER", id: req.body?.email || "UNKNOWN" })), createUser);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
