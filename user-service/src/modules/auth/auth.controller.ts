import { Request, Response } from 'express';
import AuthService from './auth.service';
import logger from '../../config/logger';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.register(req.body);
      
      logger.info({ email: req.body.email }, 'User registered successfully');
      
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Registration failed');
      
      if (error instanceof Error && error.message === 'User with this email already exists') {
        res.status(409).json({
          success: false,
          error: {
            message: 'User with this email already exists',
            code: 'USER_EXISTS',
          },
        });
        return;
      }

      res.status(400).json({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Registration failed',
          code: 'REGISTRATION_ERROR',
        },
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authService.login(req.body);
      
      logger.info({ email: req.body.email }, 'User logged in successfully');
      
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Login failed');
      
      res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
      });
    }
  }
}

export default AuthController; 