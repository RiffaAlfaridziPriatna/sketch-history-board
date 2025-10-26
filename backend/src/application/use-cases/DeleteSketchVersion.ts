import { SketchRepository } from '../../domain/repositories/SketchRepository';

export interface DeleteSketchVersionRequest {
  id: string;
  userId: string;
}

export interface DeleteSketchVersionResponse {
  success: boolean;
}

export class DeleteSketchVersionUseCase {
  constructor(private sketchRepository: SketchRepository) {}

  async execute(request: DeleteSketchVersionRequest): Promise<DeleteSketchVersionResponse> {
    const sketch = await this.sketchRepository.findByIdAndUserId(request.id, request.userId);
    
    if (!sketch) {
      return { success: false };
    }

    await this.sketchRepository.delete(request.id);
    return { success: true };
  }
}
