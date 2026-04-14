import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envLogger = new Logger('EnvConfig');

const EnvSchema = z.object({
  APP_NAME: z.string().default('Caio'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cachedEnv: AppEnv | null = null;

export function loadEnv(): AppEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsedEnv = EnvSchema.parse(process.env);
  logDefaultedEnvValues(process.env, parsedEnv);
  cachedEnv = parsedEnv;
  return parsedEnv;
}

function logDefaultedEnvValues(source: NodeJS.ProcessEnv, parsedEnv: AppEnv): void {
  for (const key of getSchemaDefaultedKeys()) {
    if (source[key] !== undefined) {
      continue;
    }

    envLogger.warn(`ENV "${key}" not provided. Using default value: ${String(parsedEnv[key])}`);
  }
}

function getSchemaDefaultedKeys(): (keyof AppEnv)[] {
  const shapeEntries = Object.entries(EnvSchema.shape);

  return shapeEntries.filter(([, schema]) => schema instanceof z.ZodDefault).map(([key]) => key as keyof AppEnv);
}
