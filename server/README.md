# Server API

API backend em **NestJS + Fastify** para gerenciamento de ideias.

## Stack

- Node runtime: `bun`
- Framework: `NestJS`
- HTTP adapter: `Fastify`
- Banco: `MariaDB/MySQL` (`mysql2`)
- Validação: `zod` via `ZodValidationPipe`
- Documentação: `Swagger` em `/docs`

## Pré-requisitos

- `bun` >= 1.3.6
- Banco MariaDB/MySQL em execução

## Instalação

```bash
bun install
```

## Configuração de ambiente

Crie um arquivo `.env` com base em `.env.example`:

```bash
cp .env.example .env
```

Variáveis disponíveis:

- `APP_NAME` - nome da aplicação (usado no título do Swagger: `APP_NAME API`)
- `NODE_ENV` - `development | test | production`
- `PORT` - porta da API
- `CORS_ORIGIN` - configuração de CORS
- `SWAGGER_DESCRIPTION` - descrição da doc Swagger
- `SWAGGER_VERSION` - versão da API na doc Swagger
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - conexão do banco

### CORS (`CORS_ORIGIN`)

Formas aceitas:

- `*` - aceita qualquer origem
- `[]` - sem origens explícitas
- JSON array: `["http://localhost:5173","https://app.seudominio.com"]`
- Lista separada por vírgula: `http://localhost:5173,https://app.seudominio.com`

Exemplo:

```env
CORS_ORIGIN=http://localhost:5173,https://app.seudominio.com
```

## Scripts

- `bun run dev` - inicia em modo watch
- `bun run start` - inicia aplicação
- `bun run build` - build TypeScript
- `bun run prod` - executa build em `dist/main.js`
- `bun run lint` - lint com ESLint
- `bun run test` - testes unitários
- `bun run test:cov` - cobertura de testes

## Migrations

- `bun run migration:generate <nome-migration>` - cria migration
- `bun run migration:up` - aplica migrations pendentes
- `bun run migration:down` - rollback da última migration

As migrations também são executadas automaticamente no bootstrap da aplicação.

## Subindo a aplicação

```bash
bun run start
```

Ao subir, logs esperados:

- `Running on http://127.0.0.1:<PORT>`
- `Swagger running on http://127.0.0.1:<PORT>/docs`

Swagger:

- [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs)

## Endpoints principais

Base: `/ideas`

- `GET /ideas?page=1&pageSize=10` - lista paginada
- `GET /ideas/:id` - busca por id
- `POST /ideas` - cria ideia
- `PATCH /ideas/:id` - atualiza ideia
- `DELETE /ideas/:id` - remove ideia

### Exemplo de resposta paginada

```json
{
  "items": [
    {
      "id": "018f3222-08b0-7f0d-a730-6f4f6b28f641",
      "whatCanBeImproved": "Melhorar deploy",
      "currentProcess": "Deploy manual",
      "improvedProcess": "Deploy automatizado",
      "benefit": "Menos falhas",
      "createdAt": "2026-04-14T19:08:12.000Z",
      "updatedAt": "2026-04-14T19:30:48.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

## Testes

```bash
bun run test
bun run test:cov
```

## Estrutura resumida

```text
src/
  common/
    config/
    database/
    pagination/
    pipes/
  modules/
    idea/
```
