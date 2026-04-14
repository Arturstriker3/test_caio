import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { Pool, RowDataPacket } from 'mysql2/promise';
import { DATABASE_CONFIG, DATABASE_POOL, type DatabaseConfig } from './database.config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @Inject(DATABASE_POOL) private readonly pool: Pool,
    @Inject(DATABASE_CONFIG) private readonly config: DatabaseConfig,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.pool.query('SELECT 1');
    this.logger.log(`Connected to MariaDB at ${this.config.host}:${this.config.port}/${this.config.database}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
    this.logger.log('MariaDB pool closed');
  }

  async ping(): Promise<boolean> {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT 1 AS isAlive');
    return rows.length > 0 && rows[0].isAlive === 1;
  }
}
