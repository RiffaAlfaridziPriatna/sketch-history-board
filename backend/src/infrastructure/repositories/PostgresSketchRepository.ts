import { SketchVersion } from '../../domain/entities/SketchVersion';
import { SketchRepository } from '../../domain/repositories/SketchRepository';
import { Database } from '../database/Database';

export class PostgresSketchRepository implements SketchRepository {
  constructor(private database: Database) {}

  async save(sketch: SketchVersion): Promise<void> {
    const props = sketch.toPersistence();
    const sql = `
      INSERT INTO sketch_versions (id, user_id, name, thumbnail, data, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    await this.database.run(sql, [
      props.id,
      props.userId,
      props.name,
      props.thumbnail,
      props.data,
      props.createdAt.toISOString(),
      props.updatedAt.toISOString(),
    ]);
  }

  async findById(id: string): Promise<SketchVersion | null> {
    const sql = 'SELECT * FROM sketch_versions WHERE id = $1';
    const row = await this.database.get(sql, [id]);
    
    if (!row) {
      return null;
    }

    return SketchVersion.fromPersistence({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      thumbnail: row.thumbnail,
      data: row.data,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<SketchVersion | null> {
    const sql = 'SELECT * FROM sketch_versions WHERE id = $1 AND user_id = $2';
    const row = await this.database.get(sql, [id, userId]);
    
    if (!row) {
      return null;
    }

    return SketchVersion.fromPersistence({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      thumbnail: row.thumbnail,
      data: row.data,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async findByUserId(userId: string): Promise<SketchVersion[]> {
    const sql = 'SELECT * FROM sketch_versions WHERE user_id = $1 ORDER BY created_at DESC';
    const rows = await this.database.all(sql, [userId]);
    
    return rows.map(row => SketchVersion.fromPersistence({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      thumbnail: row.thumbnail,
      data: row.data,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async findAll(): Promise<SketchVersion[]> {
    const sql = 'SELECT * FROM sketch_versions ORDER BY created_at DESC';
    const rows = await this.database.all(sql);
    
    return rows.map(row => SketchVersion.fromPersistence({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      thumbnail: row.thumbnail,
      data: row.data,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async delete(id: string): Promise<void> {
    const sql = 'DELETE FROM sketch_versions WHERE id = $1';
    await this.database.run(sql, [id]);
  }

  async update(sketch: SketchVersion): Promise<void> {
    const props = sketch.toPersistence();
    const sql = `
      UPDATE sketch_versions 
      SET name = $1, thumbnail = $2, data = $3, updated_at = $4
      WHERE id = $5
    `;
    
    await this.database.run(sql, [
      props.name,
      props.thumbnail,
      props.data,
      props.updatedAt.toISOString(),
      props.id,
    ]);
  }
}
