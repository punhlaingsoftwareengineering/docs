# Deployment guide

The app runs on **port 1026** everywhere (dev, preview, production) via `@sveltejs/adapter-node` and Vite.

## Quick start (Docker)

```sh
cp .env.example .env
# Set DATABASE_URL, ORIGIN, BETTER_AUTH_SECRET, GITHUB_* vars

docker compose up -d --build
```

Or without compose:

```sh
docker build -t docs .
docker run -d --name docs -p 1026:1026 --env-file .env docs
```

## Required environment variables

| Variable               | Required | Purpose                                      |
| ---------------------- | -------- | -------------------------------------------- |
| `DATABASE_URL`         | Yes      | Postgres connection string                   |
| `ORIGIN`               | Yes      | Public URL for Better Auth OAuth and CSRF    |
| `BETTER_AUTH_SECRET`   | Yes      | Auth token signing (32+ chars in production) |
| `GITHUB_CLIENT_ID`     | Yes      | GitHub OAuth                                 |
| `GITHUB_CLIENT_SECRET` | Yes      | GitHub OAuth                                 |
| `PORT`                 | No       | Default `1026`                               |
| `HOST`                 | No       | Default `0.0.0.0`                            |
| `PUBLIC_APP_NAME`      | No       | Page titles and branding                     |
| `SMTP_USER`            | No       | Gmail address for sending invitation emails  |
| `SMTP_PASS`            | No       | Gmail App Password for `SMTP_USER`           |
| `SMTP_HOST`            | No       | Default `smtp.gmail.com`                     |
| `SMTP_PORT`            | No       | Default `587`                                |
| `EMAIL_FROM`           | No       | From header; defaults to `SMTP_USER`         |

## Access modes

### Mode A — Direct access

Use when users reach the app directly (LAN IP, cloud VM public IP, `docker run -p 1026:1026`).

```env
PORT=1026
HOST=0.0.0.0
ORIGIN=http://192.168.1.50:1026
```

`ORIGIN` must **exactly** match what appears in the browser address bar, including scheme and port.

### Dev with `pnpm dev --host`

Email and password sign-in work from both `http://localhost:1026` and a LAN IP (e.g. `http://192.168.1.50:1026`).

**GitHub OAuth** registers a single callback URL (`${ORIGIN}/api/auth/callback/github`). For local dev, keep `ORIGIN=http://localhost:1026` and use GitHub sign-in from localhost. When testing from a LAN IP, use email sign-in, or temporarily set `ORIGIN` to the LAN URL and update the GitHub OAuth callback to match.

### Mode B — Behind reverse proxy

Use when TLS terminates at nginx, Caddy, or Traefik. The proxy forwards to the container on port 1026.

```env
PORT=1026
HOST=0.0.0.0
ORIGIN=https://docs.example.com
PROTOCOL_HEADER=x-forwarded-proto
HOST_HEADER=x-forwarded-host
PORT_HEADER=x-forwarded-port
```

- `ORIGIN` is the canonical public URL (required for GitHub OAuth callback registration).
- CSRF checks use forwarded headers to match the browser `Origin` header.
- Only enable `PROTOCOL_HEADER` / `HOST_HEADER` when the proxy is trusted (not exposed directly to the internet without a proxy).

## Reverse proxy examples

### Caddy

```caddy
docs.example.com {
	reverse_proxy localhost:1026
}
```

Caddy sets `X-Forwarded-Proto` and `X-Forwarded-Host` automatically.

### nginx

```nginx
server {
	listen 443 ssl;
	server_name docs.example.com;

	location / {
		proxy_pass http://127.0.0.1:1026;
		proxy_set_header Host $host;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header X-Forwarded-Host $host;
		proxy_set_header X-Forwarded-Port $server_port;
	}
}
```

## GitHub OAuth setup

1. Create a GitHub OAuth App at https://github.com/settings/developers
2. Set **Authorization callback URL** to: `${ORIGIN}/api/auth/callback/github`
   - Direct: `http://192.168.1.50:1026/api/auth/callback/github`
   - Proxy: `https://docs.example.com/api/auth/callback/github`
3. Copy Client ID and Client Secret into `.env`

## Local production test (without Docker)

```sh
pnpm build
PORT=1026 HOST=0.0.0.0 ORIGIN=http://localhost:1026 pnpm start
```

## Troubleshooting

### "Cross-site POST form submissions are forbidden"

SvelteKit CSRF protection blocks form POSTs when the server cannot determine the correct origin.

| Cause                        | Fix                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `ORIGIN` not set             | Set `ORIGIN` to the exact browser URL                                             |
| Wrong scheme                 | `https://` in browser requires `ORIGIN=https://...` or `x-forwarded-proto: https` |
| Wrong port                   | Include port in `ORIGIN` when not using 80/443 (e.g. `:1026`)                     |
| Proxy not forwarding headers | Set `PROTOCOL_HEADER` / `HOST_HEADER` and configure proxy                         |
| LAN IP changed               | Update `ORIGIN` and GitHub OAuth callback URL                                     |

### Better Auth OAuth redirect mismatch

GitHub callback URL in the OAuth app must exactly match `${ORIGIN}/api/auth/callback/github`.

### Database connection errors

Ensure `DATABASE_URL` is reachable from the container/host. For Neon, use the pooled connection string.

## Admin invitations

1. Enable [2-Step Verification](https://myaccount.google.com/security) on your Google account.
2. Create an [App Password](https://myaccount.google.com/apppasswords) for Mail.
3. Set `SMTP_USER` and `SMTP_PASS` in `.env` (optional `EMAIL_FROM` for display name).
4. Sign in as admin → **Users** → invite by email.
5. Invitee opens `/invite/[token]` and creates an account (email or GitHub).
6. Without SMTP configured, copy the invite link from the success message after inviting.

Existing deployments: run `pnpm run db:push` (or `pnpm run db:ensure`) after upgrading to add `admin_invitation` and `user.role` columns. Existing users are migrated to `role = 'admin'`. Scripts load `.env` automatically via `dotenv`.

## Build locally

```sh
pnpm install
pnpm build
```

Build uses `.env.test` for placeholder env vars during Docker compilation. Runtime secrets come from your real `.env` or container environment.

The Docker image runs `pnpm build` during the build stage and serves `build/index.js` with Node at runtime.
