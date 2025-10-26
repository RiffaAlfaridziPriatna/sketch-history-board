import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { JwtService } from '../../infrastructure/services/JwtService';

export interface GenerateAccessTokenResponse {
  user: {
    id: string;
    accessToken: string;
    createdAt: Date;
  };
  isValid: boolean;
}

export class GenerateAccessTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async execute(): Promise<GenerateAccessTokenResponse> {
    const user = User.create();
    await this.userRepository.save(user);

    const accessToken = this.jwtService.generateToken(user.id);

    return {
      user: {
        id: user.id,
        accessToken,
        createdAt: user.createdAt,
      },
      isValid: true,
    };
  }
}
