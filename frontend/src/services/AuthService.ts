import { HttpClient } from '@/infrastructure/http/HttpClient';

export interface User {
  id: string;
  accessToken: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  isValid: boolean;
}

export class AuthService {
  private httpClient: HttpClient;
  private static readonly ACCESS_TOKEN_KEY = 'sketch_access_token';

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AuthService.ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AuthService.ACCESS_TOKEN_KEY, token);
  }

  removeAccessToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AuthService.ACCESS_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  async validateToken(): Promise<AuthResponse> {
    const token = this.getAccessToken();
    
    if (!token) {
      return this.generateNewToken();
    }

    try {
      const response = await this.httpClient.get<AuthResponse>('/api/auth/validate');
      return response;
    } catch (error) {
      return this.generateNewToken();
    }
  }

  async generateNewToken(): Promise<AuthResponse> {
    const response = await this.httpClient.post<AuthResponse>('/api/auth/generate');
    this.setAccessToken(response.user.accessToken);
    return response;
  }

  async initializeAuth(): Promise<User> {
    const authResponse = await this.validateToken();
    return authResponse.user;
  }
}
