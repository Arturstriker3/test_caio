import { Inject, Injectable, Logger } from '@nestjs/common';
import { access, readdir } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Pool, PoolConnection, RowDataPacket } from 'mysql2/promise';
import { DATABASE_POOL } from './database.config';

const MIGRATIONS_TABLE = 'migrations';
const MIGRATION_FILE_REGEX = /\.migration\.(ts|js)$/;

interface DatabaseMigration {
  name: string;
  up: (connection: PoolConnection) => Promise<void>;
  down: (connection: PoolConnection) => Promise<void>;
}

interface LoadedMigrationModule {
  default?: unknown;
}

interface MigrationRow extends RowDataPacket {
  id: number;
  name: string;
}

@Injectable()
export class DatabaseMigrationService {
  private readonly logger = new Logger(DatabaseMigrationService.name);

  constructor(@Inject(DATABASE_POOL) private readonly pool: Pool) {}

  async runPendingMigrations(): Promise<void> {
    await this.ensureMigrationsTable();
    const migrations = await this.loadMigrations();
    const executedNames = await this.getExecutedMigrationNames();
    const pendingMigrations = migrations.filter((migration) => !executedNames.has(migration.name));

    if (pendingMigrations.length === 0) {
      this.logger.log('No pending migrations');
      return;
    }

    for (const migration of pendingMigrations) {
      await this.executeUpMigration(migration);
    }
  }

  async rollbackLastMigration(): Promise<void> {
    await this.ensureMigrationsTable();

    const [rows] = await this.pool.query<MigrationRow[]>(
      `SELECT \`id\`, \`name\` FROM \`${MIGRATIONS_TABLE}\` ORDER BY \`id\` DESC LIMIT 1`,
    );

    const lastExecutedMigration = rows[0];

    if (!lastExecutedMigration) {
      this.logger.log('No executed migrations to rollback');
      return;
    }

    const migrations = await this.loadMigrations();
    const migrationToRollback = migrations.find((migration) => migration.name === lastExecutedMigration.name);

    if (!migrationToRollback) {
      throw new Error(`Rollback migration file not found: ${lastExecutedMigration.name}`);
    }

    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();
      await migrationToRollback.down(connection);
      await connection.query(`DELETE FROM \`${MIGRATIONS_TABLE}\` WHERE \`id\` = ?`, [lastExecutedMigration.id]);
      await connection.commit();
      this.logger.log(`Migration rolled back: ${migrationToRollback.name}`);
    } catch (error) {
      await connection.rollback();
      this.logger.error(`Rollback failed: ${migrationToRollback.name}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  private async ensureMigrationsTable(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS \`${MIGRATIONS_TABLE}\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(255) NOT NULL,
        \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uq_migrations_name\` (\`name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  }

  private async loadMigrations(): Promise<DatabaseMigration[]> {
    const files = await this.getMigrationFiles();
    const migrations: DatabaseMigration[] = [];

    for (const file of files) {
      const migration = await this.loadMigrationFromFile(file);
      migrations.push(migration);
    }

    return migrations;
  }

  private async getMigrationFiles(): Promise<string[]> {
    const migrationsDir = await this.resolveMigrationsDirectory();

    if (!migrationsDir) {
      return [];
    }

    const entries = await readdir(migrationsDir, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && MIGRATION_FILE_REGEX.test(entry.name))
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
  }

  private async loadMigrationFromFile(fileName: string): Promise<DatabaseMigration> {
    const migrationsDir = await this.resolveMigrationsDirectory();

    if (!migrationsDir) {
      throw new Error('Migrations directory not found');
    }

    const filePath = resolve(migrationsDir, fileName);
    const fileUrl = pathToFileURL(filePath).href;
    const loadedModule = (await import(fileUrl)) as LoadedMigrationModule;
    const migration = loadedModule.default;

    if (!this.isDatabaseMigration(migration)) {
      throw new Error(`Invalid migration file: ${fileName}`);
    }

    const fallbackName = basename(fileName, extname(fileName)).replace(/\.migration$/, '');
    return {
      name: migration.name.trim() || fallbackName,
      up: migration.up,
      down: migration.down,
    };
  }

  private isDatabaseMigration(value: unknown): value is DatabaseMigration {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const maybeMigration = value as Partial<DatabaseMigration>;

    return (
      typeof maybeMigration.name === 'string' &&
      typeof maybeMigration.up === 'function' &&
      typeof maybeMigration.down === 'function'
    );
  }

  private async getExecutedMigrationNames(): Promise<Set<string>> {
    const [rows] = await this.pool.query<MigrationRow[]>(
      `SELECT \`id\`, \`name\` FROM \`${MIGRATIONS_TABLE}\` ORDER BY \`id\` ASC`,
    );

    return new Set(rows.map((row) => row.name));
  }

  private async executeUpMigration(migration: DatabaseMigration): Promise<void> {
    const connection = await this.pool.getConnection();

    try {
      await connection.beginTransaction();
      await migration.up(connection);
      await connection.query(`INSERT INTO \`${MIGRATIONS_TABLE}\` (\`name\`) VALUES (?)`, [migration.name]);
      await connection.commit();
      this.logger.log(`Migration applied: ${migration.name}`);
    } catch (error) {
      await connection.rollback();
      this.logger.error(`Migration failed: ${migration.name}`);
      throw error;
    } finally {
      connection.release();
    }
  }

  private async resolveMigrationsDirectory(): Promise<string | null> {
    const candidateDirectories = [
      resolve(process.cwd(), 'src/common/database/migrations'),
      resolve(process.cwd(), 'dist/common/database/migrations'),
      resolve(__dirname, 'migrations'),
    ];

    for (const directory of candidateDirectories) {
      try {
        await access(directory);
        return directory;
      } catch {
        continue;
      }
    }

    return null;
  }
}
