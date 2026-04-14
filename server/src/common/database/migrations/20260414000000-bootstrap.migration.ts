import type { PoolConnection } from 'mysql2/promise';

const migration = {
  name: '20260414000000-bootstrap',
  up: async (_connection: PoolConnection): Promise<void> => {
    void _connection;
    await Promise.resolve();
  },
  down: async (_connection: PoolConnection): Promise<void> => {
    void _connection;
    await Promise.resolve();
  },
};

export default migration;
