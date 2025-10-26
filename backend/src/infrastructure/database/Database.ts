import { Pool } from 'pg';

export class Database {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'sketch_history_board',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.initializeTables();
  }

  private async initializeTables(): Promise<void> {
    const createUsersTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `;

    const createSketchVersionsTableSQL = `
      CREATE TABLE IF NOT EXISTS sketch_versions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        thumbnail TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;

    try {
      await this.pool.query(createUsersTableSQL);
      await this.pool.query(createSketchVersionsTableSQL);
      console.log('Database tables initialized successfully');
    } catch (err) {
      console.error('Error creating tables:', err);
    }
  }

  async query(text: string, params: any[] = []): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async run(sql: string, params: any[] = []): Promise<{ rowCount: number }> {
    const result = await this.query(sql, params);
    return { rowCount: result.rowCount || 0 };
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    const result = await this.query(sql, params);
    return result.rows[0] || null;
  }

  async all(sql: string, params: any[] = []): Promise<any[]> {
    const result = await this.query(sql, params);
    return result.rows;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
