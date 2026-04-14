import { Global, Module } from '@nestjs/common';
import { APP_ENV } from './config.constants';
import { loadEnv } from './env';
import { ConfigService } from './config.service';

@Global()
@Module({
  providers: [
    {
      provide: APP_ENV,
      useFactory: loadEnv,
    },
    ConfigService,
  ],
  exports: [APP_ENV, ConfigService],
})
export class ConfigModule {}
