import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { Database } from '../database/Database';

export class PostgresUserRepository implements UserRepository {
  constructor(private database: Database) {}

  async save(user: User): Promise<void> {
    const props = user.toPersistence();
    const sql = `
      INSERT INTO users (id, created_at, updated_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO UPDATE SET
        updated_at = EXCLUDED.updated_at
    `;
    
    await this.database.run(sql, [
      props.id,
      props.createdAt.toISOString(),
      props.updatedAt.toISOString(),
    ]);
  }


  async findById(id: string): Promise<User | null> {
    const sql = 'SELECT * FROM users WHERE id = $1';
    const row = await this.database.get(sql, [id]);
    
    if (!row) {
      return null;
    }

    return User.fromPersistence({
      id: row.id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async delete(id: string): Promise<void> {
    const sql = 'DELETE FROM users WHERE id = $1';
    await this.database.run(sql, [id]);
  }
}
