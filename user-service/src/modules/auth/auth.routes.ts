import { Router } from 'express';
import AuthController from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema } from './auth.validators';

const router = Router();
const authController = new AuthController();

// Register new user
router.post('/register', validateRequest(registerSchema), authController.register.bind(authController));

// Login user
router.post('/login', validateRequest(loginSchema), authController.login.bind(authController));

export default router; 