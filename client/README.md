# D+Ideias Client

Frontend do dashboard de ideias, construído com React + TypeScript + Vite.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui + Base UI
- TanStack Query
- React Hook Form + Zod
- React Router

## Requisitos

- Node.js 20+
- Backend do projeto (`server`) rodando

## Configuração

1. Entre na pasta do client:

```bash
cd client
```

2. Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Ajuste a URL da API no `.env` (se necessário):

```env
VITE_API_URL=http://127.0.0.1:3000
```

## Rodando localmente

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm run dev
```

Aplicação disponível em:

- [http://127.0.0.1:5173](http://127.0.0.1:5173)

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera build de produção
- `npm run preview`: serve o build localmente
- `npm run lint`: executa o lint

## Funcionalidades

- Listagem paginada de ideias
- Criação de nova ideia
- Edição de ideia
- Exclusão com modal de confirmação
- Visualização de detalhes
- Responsividade (desktop e mobile)
- Ações por swipe no mobile (editar/excluir)
- Botão de recarregar lista no header

## Estrutura principal

```text
src/
  components/          # Componentes compartilhados e UI base
  features/ideas/      # Módulo de ideias (hooks, repository, UI, tipos)
  pages/               # Páginas da aplicação
  shared/              # HTTP client e utilidades globais
```

## Observações

- Se `VITE_API_URL` não estiver definida, o app lança erro ao iniciar requisições.
- O frontend depende da API do backend para CRUD de ideias.
