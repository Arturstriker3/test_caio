import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnv } from './common/config/env';
import { DatabaseMigrationService } from './common/database/database-migration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = loadEnv();
  app.enableShutdownHooks();
  const databaseMigrationService = app.get(DatabaseMigrationService);
  await databaseMigrationService.runPendingMigrations();

  await app.listen(env.PORT);

  const appUrl = await app.getUrl();
  Logger.log(`Running on ${appUrl}`, 'Bootstrap');
}
bootstrap();
