import { Request, Response } from 'express';
import { GenerateAccessTokenUseCase } from '../../application/use-cases/GenerateAccessToken';
import { ValidateAccessTokenUseCase } from '../../application/use-cases/ValidateAccessToken';

export class AuthController {
  constructor(
    private generateAccessTokenUseCase: GenerateAccessTokenUseCase,
    private validateAccessTokenUseCase: ValidateAccessTokenUseCase,
  ) {}

  async generateToken(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.generateAccessTokenUseCase.execute();
      res.status(201).json(result);
    } catch (error) {
      console.error('Error generating access token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid authorization header' });
        return;
      }

      const token = authHeader.substring(7);
      const result = await this.validateAccessTokenUseCase.execute({ accessToken: token });
      
      if (!result.isValid) {
        res.status(401).json({ error: 'Invalid access token' });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error('Error validating access token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
