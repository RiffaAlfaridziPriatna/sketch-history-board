import { Request, Response } from 'express';
import { CreateSketchVersionUseCase } from '../../application/use-cases/CreateSketchVersion';
import { DeleteSketchVersionUseCase } from '../../application/use-cases/DeleteSketchVersion';
import { GetAllSketchVersionsUseCase } from '../../application/use-cases/GetAllSketchVersions';
import { GetSketchVersionUseCase } from '../../application/use-cases/GetSketchVersion';
import { UpdateSketchVersionUseCase } from '../../application/use-cases/UpdateSketchVersion';

export class SketchController {
  constructor(
    private createSketchVersionUseCase: CreateSketchVersionUseCase,
    private getSketchVersionUseCase: GetSketchVersionUseCase,
    private getAllSketchVersionsUseCase: GetAllSketchVersionsUseCase,
    private deleteSketchVersionUseCase: DeleteSketchVersionUseCase,
    private updateSketchVersionUseCase: UpdateSketchVersionUseCase,
  ) {}

  async createSketchVersion(req: Request, res: Response): Promise<void> {
    try {
      const { name, thumbnail, data } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      if (!name || !thumbnail || !data) {
        res.status(400).json({ error: 'Missing required fields: name, thumbnail, data' });
        return;
      }

      const result = await this.createSketchVersionUseCase.execute({
        userId,
        name,
        thumbnail,
        data,
      });

      res.status(201).json({
        id: result.sketch.id,
        userId: result.sketch.userId,
        name: result.sketch.name,
        thumbnail: result.sketch.thumbnail,
        data: result.sketch.data,
        createdAt: result.sketch.createdAt,
        updatedAt: result.sketch.updatedAt,
      });
    } catch (error) {
      console.error('Error creating sketch version:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getSketchVersion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const result = await this.getSketchVersionUseCase.execute({ id, userId });

      if (!result.sketch) {
        res.status(404).json({ error: 'Sketch version not found' });
        return;
      }

      res.json({
        id: result.sketch.id,
        userId: result.sketch.userId,
        name: result.sketch.name,
        thumbnail: result.sketch.thumbnail,
        data: result.sketch.data,
        createdAt: result.sketch.createdAt,
        updatedAt: result.sketch.updatedAt,
      });
    } catch (error) {
      console.error('Error getting sketch version:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllSketchVersions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const result = await this.getAllSketchVersionsUseCase.execute({ userId });

      const sketches = result.sketches.map(sketch => ({
        id: sketch.id,
        userId: sketch.userId,
        name: sketch.name,
        thumbnail: sketch.thumbnail,
        data: sketch.data,
        createdAt: sketch.createdAt,
        updatedAt: sketch.updatedAt,
      }));

      res.json(sketches);
    } catch (error) {
      console.error('Error getting all sketch versions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateSketchVersion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, thumbnail, data } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const result = await this.updateSketchVersionUseCase.execute({
        id,
        userId,
        name,
        thumbnail,
        data,
      });

      res.json({
        id: result.sketch.id,
        userId: result.sketch.userId,
        name: result.sketch.name,
        thumbnail: result.sketch.thumbnail,
        data: result.sketch.data,
        createdAt: result.sketch.createdAt,
        updatedAt: result.sketch.updatedAt,
      });
    } catch (error) {
      console.error('Error updating sketch version:', error);
      if (error instanceof Error && error.message === 'Sketch version not found') {
        res.status(404).json({ error: 'Sketch version not found' });
        return;
      }
      if (error instanceof Error && error.message === 'Unauthorized to update this sketch') {
        res.status(403).json({ error: 'Unauthorized to update this sketch' });
        return;
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteSketchVersion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const result = await this.deleteSketchVersionUseCase.execute({ id, userId });

      if (!result.success) {
        res.status(404).json({ error: 'Sketch version not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting sketch version:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
