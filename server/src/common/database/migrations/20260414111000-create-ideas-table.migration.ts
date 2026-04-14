import type { PoolConnection } from 'mysql2/promise';

const migration = {
  name: '20260414111000-create-ideas-table',
  up: async (connection: PoolConnection): Promise<void> => {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ideas (
        id CHAR(36) NOT NULL,
        what_can_be_improved VARCHAR(2000) NOT NULL,
        current_process VARCHAR(2000) NOT NULL,
        improved_process VARCHAR(2000) NOT NULL,
        benefit VARCHAR(2000) NOT NULL,
        created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        INDEX idx_ideas_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
  },
  down: async (connection: PoolConnection): Promise<void> => {
    await connection.query('DROP TABLE IF EXISTS ideas;');
  },
};

export default migration;
