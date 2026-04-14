import { loadEnv } from '../config/env';

export const DATABASE_CONFIG = Symbol('DATABASE_CONFIG');

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export function createDatabaseConfig(): DatabaseConfig {
  const env = loadEnv();

  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  };
}
