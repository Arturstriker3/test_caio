import { Global, Module } from '@nestjs/common';
import { createDatabaseConfig, createDatabasePool, DATABASE_CONFIG, DATABASE_POOL } from './database.config';
import { DatabaseMigrationService } from './database-migration.service';
import { DatabaseService } from './database.service';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONFIG,
      useFactory: createDatabaseConfig,
    },
    {
      provide: DATABASE_POOL,
      inject: [DATABASE_CONFIG],
      useFactory: createDatabasePool,
    },
    DatabaseMigrationService,
    DatabaseService,
  ],
  exports: [DATABASE_CONFIG, DATABASE_POOL, DatabaseMigrationService, DatabaseService],
})
export class DatabaseModule {}
