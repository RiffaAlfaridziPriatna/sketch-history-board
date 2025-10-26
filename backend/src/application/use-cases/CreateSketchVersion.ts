import { SketchVersion } from '../../domain/entities/SketchVersion';
import { SketchRepository } from '../../domain/repositories/SketchRepository';

export interface CreateSketchVersionRequest {
  userId: string;
  name: string;
  thumbnail: string;
  data: string;
}

export interface CreateSketchVersionResponse {
  sketch: SketchVersion;
}

export class CreateSketchVersionUseCase {
  constructor(private sketchRepository: SketchRepository) {}

  async execute(request: CreateSketchVersionRequest): Promise<CreateSketchVersionResponse> {
    const sketch = SketchVersion.create({
      userId: request.userId,
      name: request.name,
      thumbnail: request.thumbnail,
      data: request.data,
    });

    await this.sketchRepository.save(sketch);

    return { sketch };
  }
}
