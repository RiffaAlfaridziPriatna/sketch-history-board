export interface HttpClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  getAuthToken?: () => string | null;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    const authToken = this.config.getAuthToken?.();
    const authHeaders: Record<string, string> = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
    
    const requestConfig: RequestInit = {
      method: options.method || 'GET',
      headers: {
        ...this.config.headers,
        ...authHeaders,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.config.timeout);
    
    try {
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      if (!text) {
        return {} as T;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
