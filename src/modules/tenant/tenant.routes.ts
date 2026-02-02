import { Router } from 'express';
import * as ctrl from './tenant.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';

const router = Router();

router.post('/', authMiddleware, requireRole('ADMIN'), ctrl.createTenant);
router.get('/', authMiddleware, ctrl.getTenants);
router.put('/:id', authMiddleware, ctrl.updateTenant);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), ctrl.deleteTenant);

export default router;
