import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './common/config/config.service';
import { DatabaseMigrationService } from './common/database/database-migration.service';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  const configService = app.get(ConfigService);
  const swagger = configService.swagger;
  const cors = configService.cors;
  app.useGlobalPipes(new ZodValidationPipe());
  app.enableShutdownHooks();
  app.enableCors({
    origin: cors.origin,
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);
  const databaseMigrationService = app.get(DatabaseMigrationService);
  await databaseMigrationService.runPendingMigrations();

  await app.listen(configService.port);

  const appUrl = await app.getUrl();
  const swaggerUrl = `${appUrl}/docs`;
  Logger.log(`Running on ${appUrl}`, 'Bootstrap');
  Logger.log(`Swagger running on ${swaggerUrl}`, 'Bootstrap');
}
bootstrap().catch((err: unknown) => {
  console.error('Bootstrap failed:', err instanceof Error ? err.message : 'Unknown error');
  process.exit(1);
});
