import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export class JwtService {
  private readonly secretKey: string;
  private readonly expiresIn: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY || 'your-super-secret-jwt-key-change-this-in-production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  generateToken(userId: string): string {
    const payload: JwtPayload = {
      userId,
    };

    return jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
      issuer: 'sketch-history-board',
      audience: 'sketch-history-board-users',
    } as jwt.SignOptions);
  }

  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.secretKey, {
        issuer: 'sketch-history-board',
        audience: 'sketch-history-board-users',
      } as jwt.VerifyOptions) as JwtPayload;

      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  generateUserId(): string {
    return uuidv4();
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      if (!decoded || !decoded.exp) {
        return true;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
