import { Global, Module } from '@nestjs/common';
import { createDatabaseConfig, DATABASE_CONFIG } from './database.config';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONFIG,
      useFactory: createDatabaseConfig,
    },
  ],
  exports: [DATABASE_CONFIG],
})
export class DatabaseModule {}
