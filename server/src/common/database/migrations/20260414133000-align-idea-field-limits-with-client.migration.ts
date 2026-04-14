import type { PoolConnection } from 'mysql2/promise';

const migration = {
  name: '20260414133000-align-idea-field-limits-with-client',
  up: async (connection: PoolConnection): Promise<void> => {
    await connection.query(`
      UPDATE ideas
      SET what_can_be_improved = LEFT(what_can_be_improved, 180)
      WHERE CHAR_LENGTH(what_can_be_improved) > 180;
    `);

    await connection.query(`
      ALTER TABLE ideas
      MODIFY COLUMN what_can_be_improved VARCHAR(180) NOT NULL;
    `);
  },
  down: async (connection: PoolConnection): Promise<void> => {
    await connection.query(`
      ALTER TABLE ideas
      MODIFY COLUMN what_can_be_improved VARCHAR(720) NOT NULL;
    `);
  },
};

export default migration;
