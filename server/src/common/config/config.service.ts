import { Inject, Injectable } from '@nestjs/common';
import { APP_ENV } from './config.constants';
import type { AppEnv } from './env';

type SwaggerConfig = {
  title: string;
  description: string;
  version: string;
};

@Injectable()
export class ConfigService {
  constructor(@Inject(APP_ENV) private readonly env: AppEnv) {}

  get all(): AppEnv {
    return this.env;
  }

  get port(): number {
    return this.env.PORT;
  }

  get swagger(): SwaggerConfig {
    return {
      title: `${this.env.APP_NAME} API`,
      description: this.env.SWAGGER_DESCRIPTION,
      version: this.env.SWAGGER_VERSION,
    };
  }
}
