import { SketchVersion } from '../entities/SketchVersion';

export interface SketchRepository {
  save(sketch: SketchVersion): Promise<void>;
  findById(id: string): Promise<SketchVersion | null>;
  findByIdAndUserId(id: string, userId: string): Promise<SketchVersion | null>;
  findByUserId(userId: string): Promise<SketchVersion[]>;
  findAll(): Promise<SketchVersion[]>;
  delete(id: string): Promise<void>;
  update(sketch: SketchVersion): Promise<void>;
}
