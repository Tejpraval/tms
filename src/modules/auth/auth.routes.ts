//D:\resumeproject\server\src\modules\auth\auth.routes.ts
import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout
} from './auth.controller';
import { csrfMiddleware } from '../../middleware/csrf.middleware';


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/refresh', csrfMiddleware, refresh);
router.post('/logout', csrfMiddleware, logout);


export default router;
