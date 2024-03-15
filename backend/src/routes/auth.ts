import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { validateAuth } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.get('/profile', authenticate, getProfile);

export default router;
