import { HttpClient } from '@/infrastructure/http/HttpClient';
import { AuthService } from './AuthService';
import { SketchService } from './SketchService';

export class ServiceContainer {
  private static instance: ServiceContainer;
  private httpClient: HttpClient;
  private authService: AuthService;
  private sketchService: SketchService;

  private constructor() {
    this.httpClient = new HttpClient({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 10000,
      getAuthToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('sketch_access_token');
      },
    });

    this.authService = new AuthService(this.httpClient);
    this.sketchService = new SketchService(this.httpClient);
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  getHttpClient(): HttpClient {
    return this.httpClient;
  }

  getAuthService(): AuthService {
    return this.authService;
  }

  getSketchService(): SketchService {
    return this.sketchService;
  }
}

export const serviceContainer = ServiceContainer.getInstance();
