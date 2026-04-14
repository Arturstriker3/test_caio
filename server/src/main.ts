import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';
import { DatabaseMigrationService } from './common/database/database-migration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  const databaseMigrationService = app.get(DatabaseMigrationService);
  await databaseMigrationService.runPendingMigrations();

  await app.listen(configService.port);

  const appUrl = await app.getUrl();
  Logger.log(`Running on ${appUrl}`, 'Bootstrap');
}
bootstrap().catch((err: unknown) => {
  console.error('Bootstrap failed:', err instanceof Error ? err.message : 'Unknown error');
  process.exit(1);
});
