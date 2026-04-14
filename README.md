# D+Ideias

Aplicação full stack para gestão de ideias de melhoria.

## O que tem no projeto

- `server`: API em NestJS + Bun + Fastify + MariaDB
- `client`: frontend em React + Vite
- `docker-compose.yml`: sobe banco, API e frontend (Nginx)

## Subir tudo com Docker (recomendado)

Na raiz do projeto:

```bash
docker compose up -d --build
```

Serviços:

- Frontend: [http://localhost:8080](http://localhost:8080)
- API: [http://localhost:3000](http://localhost:3000)
- Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)
- Banco MariaDB: `localhost:3306`

Para parar:

```bash
docker compose down
```

Para limpar volumes (inclui dados do banco):

```bash
docker compose down -v
```

## Rodar sem Docker (modo desenvolvimento)

### 1) Banco

```bash
docker compose -f docker-compose.database.yml up -d
```

### 2) API

```bash
cd server
cp .env.example .env
bun install
bun run dev
```

### 3) Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

URLs em dev:

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Observações

- A API roda migrations no bootstrap.
- O frontend depende de `VITE_API_URL` para consumir a API.
- CORS da API já está configurado para `localhost:8080` e `localhost:5173`.
