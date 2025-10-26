import { HttpClient } from '@/infrastructure/http/HttpClient';
import { SketchVersion } from '@/types';

export class SketchService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async createSketchVersion(sketch: Omit<SketchVersion, 'id' | 'createdAt' | 'updatedAt'>): Promise<SketchVersion> {
    return this.httpClient.post<SketchVersion>('/api/sketches', sketch);
  }

  async getAllSketchVersions(): Promise<SketchVersion[]> {
    return this.httpClient.get<SketchVersion[]>('/api/sketches');
  }

  async getSketchVersion(id: string): Promise<SketchVersion> {
    return this.httpClient.get<SketchVersion>(`/api/sketches/${id}`);
  }

  async deleteSketchVersion(id: string): Promise<void> {
    return this.httpClient.delete<void>(`/api/sketches/${id}`);
  }

  async updateSketchVersion(id: string, sketch: Partial<SketchVersion>): Promise<SketchVersion> {
    return this.httpClient.put<SketchVersion>(`/api/sketches/${id}`, sketch);
  }
}
