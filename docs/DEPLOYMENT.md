# Deployment guide

The app runs on **port 1026** everywhere (dev, preview, production) via `@sveltejs/adapter-node` and Vite.

Authentication uses **employee-portal SSO** (same model as PHH-DRIVE). See [employee-portal/docs/shared-auth-sso.md](../../employee-portal/docs/shared-auth-sso.md) for the full env contract.

## Quick start (Docker)

```sh
cp .env.example .env
# Set DATABASE_URL (CMS), AUTH_DATABASE_URL, PORTAL_DATABASE_URL, ORIGIN, PORTAL_ORIGIN,
# AUTH_COOKIE_DOMAIN, BETTER_AUTH_SECRET (same as portal)

docker compose up -d --build
```

Or without compose:

```sh
docker build -t docs .
docker run -d --name docs -p 1026:1026 --env-file .env docs
```

## Required environment variables

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `DATABASE_URL` | Yes | Local Postgres for CMS (`document`, `category`, `site_settings`, …) |
| `AUTH_DATABASE_URL` | Yes | Portal Postgres for shared auth tables |
| `PORTAL_DATABASE_URL` | Yes* | Portal Postgres for permission checks (*defaults to `AUTH_DATABASE_URL`) |
| `ORIGIN` | Yes | Public docs URL (e.g. `https://docs.phh.com`) |
| `PORTAL_ORIGIN` | Yes | Employee portal URL for login redirects |
| `AUTH_COOKIE_DOMAIN` | Yes (SSO) | Shared cookie domain (e.g. `.phh.com`, `.local.test`) |
| `BETTER_AUTH_SECRET` | Yes | Must match portal and drive |
| `AUTH_SESSION_EXPIRES_IN` | No | Default `7d` — keep in sync with portal |
| `AUTH_SESSION_UPDATE_AGE` | No | Default `30m` |
| `AUTH_SESSION_COOKIE_CACHE_MAX_AGE` | No | Default `30m` |
| `PORT` | No | Default `1026` |
| `HOST` | No | Default `0.0.0.0` |
| `PUBLIC_APP_NAME` | No | Page titles and branding |

## Local dev with portal SSO

Use **employee-portal Caddy** — browse `http://docs.local.test`, not `localhost:1026`.

1. In **employee-portal** `.env`: `DOCS_ORIGIN=http://docs.local.test`, `CADDY_DOCS_UPSTREAM=localhost:1026`
2. Run hosts script (Administrator PowerShell): `employee-portal/scripts/setup-local-sso-hosts.ps1`
3. Four terminals:

   ```powershell
   cd employee-portal && pnpm dev      # 1027
   cd drive && pnpm dev                # 1025 (optional)
   cd docs && pnpm dev                 # 1026
   cd employee-portal && pnpm caddy:dev
   ```

4. In **docs** `.env` (see `.env.example`):

   ```env
   ORIGIN=http://docs.local.test
   PORTAL_ORIGIN=http://portal.local.test
   AUTH_COOKIE_DOMAIN=.local.test
   BETTER_AUTH_SECRET=<same as portal>
   AUTH_DATABASE_URL=<portal postgres>
   PORTAL_DATABASE_URL=<portal postgres>
   DATABASE_URL=postgres://...@localhost:5432/docs
   ```

5. Portal **Settings → Access roles** — assign **Docs** service to your role
6. Sign in at `portal.local.test`, then open `docs.local.test/admin`

## Access modes

### Mode A — Direct access

```env
PORT=1026
HOST=0.0.0.0
ORIGIN=http://192.168.1.50:1026
PORTAL_ORIGIN=http://portal.example.com:1027
AUTH_COOKIE_DOMAIN=.example.com
```

`ORIGIN` must **exactly** match what appears in the browser address bar.

### Mode B — Behind reverse proxy

```env
ORIGIN=https://docs.phh.com
PORTAL_ORIGIN=https://phh.com
AUTH_COOKIE_DOMAIN=.phh.com
PROTOCOL_HEADER=x-forwarded-proto
HOST_HEADER=x-forwarded-host
PORT_HEADER=x-forwarded-port
```

For local SSO, employee-portal owns Caddy (`Caddyfile.generated` from `.env`).

## CMS database

Auth tables live in **portal Postgres** — do not run auth migrations against `DATABASE_URL`.

```sh
pnpm run db:push   # CMS tables on DATABASE_URL only
```

## Granting admin access

Docs does not manage users. In employee-portal:

1. Ensure `DOCS_ORIGIN` is set (registers Docs service tile)
2. **Settings → Access roles** — add **Docs** service to the appropriate role(s)
3. Portal admins always have access

## Local production test (without Docker)

```sh
pnpm build
PORT=1026 HOST=0.0.0.0 ORIGIN=http://docs.local.test pnpm start
```

## Troubleshooting

### Redirect loop or no session

- `BETTER_AUTH_SECRET` and `AUTH_COOKIE_DOMAIN` must match portal
- Browse via `ORIGIN` hostname (e.g. `docs.local.test`), not raw port
- `ORIGIN` must match the browser URL exactly

### 403 on `/admin`

- User is signed in but lacks Docs service on their portal access role

### Database connection errors

- `DATABASE_URL` — CMS only
- `AUTH_DATABASE_URL` / `PORTAL_DATABASE_URL` — must reach portal Postgres

### "Cross-site POST form submissions are forbidden"

Set `ORIGIN` correctly; behind a proxy, configure `PROTOCOL_HEADER` / `HOST_HEADER`.

## Build locally

```sh
pnpm install
pnpm build
```

Build uses `.env.test` for placeholder env vars during Docker compilation. Runtime secrets come from your real `.env` or container environment.
