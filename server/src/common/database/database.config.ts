import { createPool, type Pool } from 'mysql2/promise';
import type { AppEnv } from '../config/env';

export const DATABASE_CONFIG = Symbol('DATABASE_CONFIG');
export const DATABASE_POOL = Symbol('DATABASE_POOL');

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export function createDatabaseConfig(env: AppEnv): DatabaseConfig {
  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  };
}

export function createDatabasePool(config: DatabaseConfig): Pool {
  return createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    timezone: 'Z',
  });
}
