import { SketchVersion } from '../../domain/entities/SketchVersion';
import { SketchRepository } from '../../domain/repositories/SketchRepository';

export interface UpdateSketchVersionRequest {
  id: string;
  userId: string;
  name?: string;
  thumbnail?: string;
  data?: string;
}

export interface UpdateSketchVersionResponse {
  sketch: SketchVersion;
}

export class UpdateSketchVersionUseCase {
  constructor(private sketchRepository: SketchRepository) {}

  async execute(request: UpdateSketchVersionRequest): Promise<UpdateSketchVersionResponse> {
    const existingSketch = await this.sketchRepository.findById(request.id);
    
    if (!existingSketch) {
      throw new Error('Sketch version not found');
    }

    if (existingSketch.userId !== request.userId) {
      throw new Error('Unauthorized to update this sketch');
    }

    const updateData: Partial<{
      name: string;
      thumbnail: string;
      data: string;
    }> = {};

    if (request.name !== undefined) updateData.name = request.name;
    if (request.thumbnail !== undefined) updateData.thumbnail = request.thumbnail;
    if (request.data !== undefined) updateData.data = request.data;

    existingSketch.update(updateData);
    await this.sketchRepository.update(existingSketch);

    return { sketch: existingSketch };
  }
}
