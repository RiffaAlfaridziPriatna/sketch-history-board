import { SketchVersion } from '../../domain/entities/SketchVersion';
import { SketchRepository } from '../../domain/repositories/SketchRepository';

export interface GetSketchVersionRequest {
  id: string;
  userId: string;
}

export interface GetSketchVersionResponse {
  sketch: SketchVersion | null;
}

export class GetSketchVersionUseCase {
  constructor(private sketchRepository: SketchRepository) {}

  async execute(request: GetSketchVersionRequest): Promise<GetSketchVersionResponse> {
    const sketch = await this.sketchRepository.findByIdAndUserId(request.id, request.userId);
    return { sketch };
  }
}
