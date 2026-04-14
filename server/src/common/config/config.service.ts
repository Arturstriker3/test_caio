import { Inject, Injectable } from '@nestjs/common';
import { APP_ENV } from './config.constants';
import type { AppEnv } from './env';

type SwaggerConfig = {
  title: string;
  description: string;
  version: string;
};

type CorsConfig = {
  origin: string | string[];
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

  get cors(): CorsConfig {
    return {
      origin: this.parseCorsOrigin(this.env.CORS_ORIGIN),
    };
  }

  private parseCorsOrigin(origin: string): string | string[] {
    const normalizedOrigin = origin.trim();

    if (!normalizedOrigin || normalizedOrigin === '*') {
      return '*';
    }

    if (normalizedOrigin === '[]') {
      return [];
    }

    if (normalizedOrigin.startsWith('[') && normalizedOrigin.endsWith(']')) {
      const parsedOrigin = this.safeParseJsonArray(normalizedOrigin);

      if (parsedOrigin) {
        return parsedOrigin;
      }
    }

    return normalizedOrigin
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private safeParseJsonArray(value: string): string[] | null {
    try {
      const parsed = JSON.parse(value);

      if (!Array.isArray(parsed)) {
        return null;
      }

      return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch {
      return null;
    }
  }
}
