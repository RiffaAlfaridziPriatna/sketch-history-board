import { UserRepository } from '../../domain/repositories/UserRepository';
import { JwtService } from '../../infrastructure/services/JwtService';

export interface ValidateAccessTokenRequest {
  accessToken: string;
}

export interface ValidateAccessTokenResponse {
  user: {
    id: string;
    accessToken: string;
    createdAt: Date;
  } | null;
  isValid: boolean;
}

export class ValidateAccessTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async execute(request: ValidateAccessTokenRequest): Promise<ValidateAccessTokenResponse> {
    const jwtPayload = this.jwtService.verifyToken(request.accessToken);
    
    if (!jwtPayload) {
      return {
        user: null,
        isValid: false,
      };
    }

    const user = await this.userRepository.findById(jwtPayload.userId);
    
    if (!user) {
      return {
        user: null,
        isValid: false,
      };
    }

    return {
      user: {
        id: user.id,
        accessToken: request.accessToken,
        createdAt: user.createdAt,
      },
      isValid: true,
    };
  }
}
