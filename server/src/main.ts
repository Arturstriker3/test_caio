import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';
import { DatabaseMigrationService } from './common/database/database-migration.service';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ZodValidationPipe());
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
