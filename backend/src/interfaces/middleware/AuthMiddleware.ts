import { NextFunction, Request, Response } from 'express';
import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { JwtService } from '../../infrastructure/services/JwtService';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export class AuthMiddleware {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid authorization header' });
        return;
      }

      const token = authHeader.substring(7);
      const jwtPayload = this.jwtService.verifyToken(token);
      
      if (!jwtPayload) {
        res.status(401).json({ error: 'Invalid or expired access token' });
        return;
      }

      const user = await this.userRepository.findById(jwtPayload.userId);
      
      if (!user) {
        res.status(401).json({ error: 'User not found' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
