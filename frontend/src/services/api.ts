import { SketchVersion } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  static async createSketchVersion(sketch: Omit<SketchVersion, 'id' | 'createdAt' | 'updatedAt'>): Promise<SketchVersion> {
    return this.request<SketchVersion>('/api/sketches', {
      method: 'POST',
      body: JSON.stringify(sketch),
    });
  }

  static async getAllSketchVersions(): Promise<SketchVersion[]> {
    return this.request<SketchVersion[]>('/api/sketches');
  }

  static async getSketchVersion(id: string): Promise<SketchVersion> {
    return this.request<SketchVersion>(`/api/sketches/${id}`);
  }

  static async deleteSketchVersion(id: string): Promise<void> {
    await this.request<void>(`/api/sketches/${id}`, {
      method: 'DELETE',
    });
  }
}
