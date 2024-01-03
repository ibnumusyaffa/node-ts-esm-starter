# Node Typescript ESM

Opiniated project template for a Node.js & TypeScript apps with native ESM

## Features

- Node.js 18+
- TypeScript 5.3
- Native ESM Modules 
- [tsx: Node.js enhanced to run TypeScript & ESM files](https://github.com/privatenumber/tsx)
- [tsc-alias: Import path alias using `@/` prefix](https://github.com/justkey007/tsc-alias) 
- Express.js
- Drizzle for ORM & Migrations
- Pino for logging
- RabbitMQ for job queue
- ESLint & Prettier — linting & formatting
- [jsx-email](https://github.com/shellscape/jsx-email) for email templating

## Quick Start

### 1. Clone repo

clone repo without commit history

```bash
git clone --depth=1 https://github.com/ibnumusyaffa/node-ts-esm-starter my-project-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```


## Available scripts

- `npm run dev` — Starts the application in development mode at.
- `npm run build` — Compile the application.
- `npm start` — Starts the application in production mode.
- `npm run lint` — Check code using ESLint.
- `npm run lint:fix` — Fix autofixable ESLint problem.
- `npm run format:all` — Format code using Prettier for all files.
- `npm run format:check` — Check code format using prettier.
- `npm run db:generate` — Generate migration from changed schema.
- `npm run db:migrate` - Apply migration to database.
- `npm run worker:send-email` - Run example worker.
