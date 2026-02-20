import { Router } from 'express';
import { getUsers, createUser, updateUserRole, deleteUser } from './user.controller';
import { requirePermission } from '../../middleware/requirePermission';
import authMiddleware from '../../middleware/auth.middleware';
import { Permission } from '../../constants/permissions';

const router = Router();

// ALL operations require authentication and USER_MANAGE permission
router.use(authMiddleware);
router.use(requirePermission(Permission.USER_MANAGE));

router.get('/', getUsers);
router.post('/', createUser);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
