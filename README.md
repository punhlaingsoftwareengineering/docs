# docs.zarnihlawn.com

Personal software documentation site built with SvelteKit, Drizzle, and Better Auth.

## Prerequisites

- Node.js 22+
- npm (comes with Node)
- PostgreSQL (Neon or self-hosted)

## Setup

```sh
cp .env.example .env
# Edit .env — DATABASE_URL (CMS), AUTH_DATABASE_URL, PORTAL_DATABASE_URL,
# ORIGIN, PORTAL_ORIGIN, AUTH_COOKIE_DOMAIN, BETTER_AUTH_SECRET (match portal)

npm install
npm run db:ensure
```

## Development

```sh
npm run dev

# Open browser automatically
npm run dev -- --open
```

Dev, preview, and production all run on **port 1026**. For local SSO, browse **`http://docs.local.test`** (via employee-portal Caddy), not `localhost:1026`.

Admin CRUD (`/admin`) requires employee-portal login and the **Documentation** service on your access role.

## Build and preview

```sh
npm run build
npm run preview
```

## Production (Docker)

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full deployment guide.

```sh
docker build -t docs .
docker run --rm -p 1026:1026 --env-file .env docs
```

## Common tasks

| Task         | Command              |
| ------------ | -------------------- |
| Typecheck    | `npm run check`      |
| Lint         | `npm run lint`       |
| Format       | `npm run format`     |
| DB push      | `npm run db:push`    |
| Unit tests   | `npm run test:unit`  |
| E2E tests    | `npm run test:e2e`   |
| Start (prod) | `npm start`          |
