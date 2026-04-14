import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const migrationsDir = resolve(process.cwd(), 'src/common/database/migrations');

async function main(): Promise<void> {
  const rawName = process.argv.slice(2).join('-').trim();

  if (!rawName) {
    throw new Error('Usage: bun run migration:generate <migration-name>');
  }

  const normalizedName = normalizeName(rawName);

  if (!normalizedName) {
    throw new Error('Invalid migration name. Use letters and numbers.');
  }

  const timestamp = createTimestamp();
  const migrationName = `${timestamp}-${normalizedName}`;
  const fileName = `${migrationName}.migration.ts`;
  const filePath = join(migrationsDir, fileName);

  await mkdir(migrationsDir, { recursive: true });
  await writeFile(filePath, buildTemplate(migrationName), { flag: 'wx' });

  console.log(`Migration created: src/common/database/migrations/${fileName}`);
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createTimestamp(): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hour}${minute}${second}`;
}

function buildTemplate(migrationName: string): string {
  return `import type { PoolConnection } from 'mysql2/promise';\n\nconst migration = {\n  name: '${migrationName}',\n  up: async (_connection: PoolConnection): Promise<void> => {\n    void _connection;\n    await Promise.resolve();\n    // TODO: add migration UP SQL.\n  },\n  down: async (_connection: PoolConnection): Promise<void> => {\n    void _connection;\n    await Promise.resolve();\n    // TODO: add migration DOWN SQL.\n  },\n};\n\nexport default migration;\n`;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(message);
  process.exit(1);
});
