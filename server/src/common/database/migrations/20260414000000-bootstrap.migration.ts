import type { PoolConnection } from 'mysql2/promise';

const migration = {
  name: '20260414000000-bootstrap',
  up: async (_connection: PoolConnection): Promise<void> => {
    void _connection;
    await Promise.resolve();
    // Initial migration placeholder for project bootstrap.
  },
  down: async (_connection: PoolConnection): Promise<void> => {
    void _connection;
    await Promise.resolve();
    // Initial rollback placeholder for project bootstrap.
  },
};

export default migration;
