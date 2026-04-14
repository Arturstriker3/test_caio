import { Inject, Injectable } from '@nestjs/common';
import { APP_ENV } from './config.constants';
import type { AppEnv } from './env';

@Injectable()
export class ConfigService {
  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {}

  get all(): AppEnv {
    return this.env;
  }

  get port(): number {
    return this.env.PORT;
  }
}
