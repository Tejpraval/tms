//D:\resumeproject\server\src\modules\auth\auth.routes.ts
import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe
} from './auth.controller';
import { csrfMiddleware } from '../../middleware/csrf.middleware';
import authMiddleware from '../../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { message: 'Too many auth requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});


const router = Router();

// Apply global auth rate-limiter
router.use(authLimiter);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/refresh', csrfMiddleware, refresh);
router.post('/logout', csrfMiddleware, logout);

// Protected routes
router.get('/me', authMiddleware, getMe);

export default router;
