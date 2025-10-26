import { SketchVersion } from '../../domain/entities/SketchVersion';
import { SketchRepository } from '../../domain/repositories/SketchRepository';

export interface GetAllSketchVersionsRequest {
  userId: string;
}

export interface GetAllSketchVersionsResponse {
  sketches: SketchVersion[];
}

export class GetAllSketchVersionsUseCase {
  constructor(private sketchRepository: SketchRepository) {}

  async execute(request: GetAllSketchVersionsRequest): Promise<GetAllSketchVersionsResponse> {
    const sketches = await this.sketchRepository.findByUserId(request.userId);
    return { sketches };
  }
}
