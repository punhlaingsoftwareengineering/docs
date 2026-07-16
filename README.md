# docs.zarnihlawn.com

Personal software documentation site built with SvelteKit 2, Drizzle, and Better Auth.

## Prerequisites

- [pnpm](https://pnpm.io/) 10+
- Node.js 22+
- PostgreSQL (Neon or self-hosted)

## Setup

```sh
cp .env.example .env
# Edit .env — DATABASE_URL (CMS), AUTH_DATABASE_URL, PORTAL_DATABASE_URL,
# ORIGIN, PORTAL_ORIGIN, AUTH_COOKIE_DOMAIN, BETTER_AUTH_SECRET (match portal)

pnpm install
pnpm run db:ensure
```

## Development

```sh
pnpm dev

# Open browser automatically
pnpm dev -- --open
```

Dev, preview, and production all run on **port 1026**. For local SSO, browse **`http://docs.local.test`** (via employee-portal Caddy), not `localhost:1026`.

Admin CRUD (`/admin`) requires employee-portal login and the **Documentation** service on your access role.

## Build and preview

```sh
pnpm build
pnpm preview
```

## Production (Docker)

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full deployment guide.

```sh
docker build -t docs .
docker run --rm -p 1026:1026 --env-file .env docs
```

## Common tasks

| Task         | Command          |
| ------------ | ---------------- |
| Typecheck    | `pnpm check`     |
| Lint         | `pnpm lint`      |
| Format       | `pnpm format`    |
| DB push      | `pnpm db:push`   |
| Unit tests   | `pnpm test:unit` |
| E2E tests    | `pnpm test:e2e`  |
| Start (prod) | `pnpm start`     |
