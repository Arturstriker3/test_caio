import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { DatabaseMigrationService } from '../database-migration.service';

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const migrationService = app.get(DatabaseMigrationService);
    await migrationService.rollbackLastMigration();
  } finally {
    await app.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
