import { Router } from 'express';
import { loginController, me, signup } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', loginController);
authRouter.get('/me', requireAuth, me);
