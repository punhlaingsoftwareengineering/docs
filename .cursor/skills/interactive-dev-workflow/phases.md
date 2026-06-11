# Architecture phases — question bank

One question per turn. Mark answered in `.cursor/workflow-state.md`. Skip if rule or code already reflects the decision.

---

## Phase 0 — Bootstrap

### 0.1 Resume or restart

**Ask:** Are we resuming a previous workflow session or starting fresh?

- Resume → read `workflow-state.md`, continue at recorded phase/step
- Restart → reset workflow-state, begin at 0.2

### 0.2 App purpose

**Ask:** What is this app for, and who is the primary audience?

Record: one-sentence purpose + audience. Drives `app-structure.mdc`.

### 0.3 Success criteria

**Ask:** What is the single most important thing a user should be able to do on v1?

Record: primary user action. Drives Phase 7 feature priority.

---

## Phase 1 — Routes

### 1.1 URL map

**Ask:** List the top-level routes (paths) the app needs at v1.

Options to offer if user is unsure: `/`, `/docs`, `/docs/[slug]`, `/login`, `/dashboard`.

### 1.2 Route groups

**Ask:** Should routes use SvelteKit groups?

- `(marketing)` — public pages
- `(app)` — authenticated app shell
- `(auth)` — login/register only
- Flat structure — no groups

### 1.3 Layout hierarchy

**Ask:** Which routes share a layout (nav, sidebar, footer)?

Record: layout tree. Drives `+layout.svelte` files.

### 1.4 Demo routes

**Ask:** Keep, move, or remove existing `/demo/*` routes?

Only ask if `src/routes/demo/` exists.

### 1.5 Protected routes

**Ask:** Which routes require authentication?

Record: list of protected path prefixes. Feeds Phase 4.

---

## Phase 2 — `$lib` structure

### 2.1 Components

**Ask:** Where do shared UI components live?

Default: `src/lib/components/` with subfolders (`ui/`, `layout/`, `forms/`).

### 2.2 Schemas

**Ask:** Where do Zod schemas live?

Default: `src/lib/schemas/`.

### 2.3 Server services

**Ask:** How should server business logic be organized?

Default: `src/lib/server/services/` for domain logic; `db/` for Drizzle only.

### 2.4 Utils and types

**Ask:** Separate `src/lib/utils/` and `src/lib/types/`?

Default: yes for utils; types colocated unless shared across features.

---

## Phase 3 — Data

### 3.1 ID strategy

**Ask:** UUID or serial integer primary keys for user-facing entities?

Default per project rules: UUID for public-facing records.

### 3.2 Core tables

**Ask:** What are the core database tables for v1?

One table list with brief purpose each.

### 3.3 Relations

**Ask:** How do those tables relate (1:1, 1:N, N:M)?

Record: relation diagram in words.

### 3.4 Migration workflow

**Ask:** Push (`db:push`) or migrate (`db:generate` + `db:migrate`) for schema changes?

Default: migrate for production-bound apps.

---

## Phase 4 — Auth

### 4.1 Auth scope

**Ask:** Which features require login vs optional vs public?

Map routes from Phase 1 to auth requirement.

### 4.2 Providers

**Ask:** Which auth methods? (email/password, GitHub OAuth, others)

Match `src/lib/server/auth.ts` config or plan changes.

### 4.3 Roles

**Ask:** Are there user roles (admin, editor, viewer) or single role?

If roles: record names and what each can access.

### 4.4 Session in load

**Ask:** Redirect unauthenticated users or show limited UI?

Default: redirect to login for protected routes.

---

## Phase 5 — Validation

### 5.1 Schema location

**Ask:** Confirm `src/lib/schemas/` layout — one file per domain or per route?

### 5.2 Form error shape

**Ask:** How should validation errors reach the UI?

Default: `fail(400, { errors: fieldErrors })` + display in form.

### 5.3 Shared vs route schemas

**Ask:** Which schemas are shared client+server vs server-only?

---

## Phase 6 — UI

### 6.1 daisyUI setup

**Ask:** Install daisyUI and which themes?

Default: `light --default`, `dark --prefersdark`.

### 6.2 App shell

**Ask:** Describe the global layout (navbar, sidebar, footer, content width).

### 6.3 Component conventions

**Ask:** Use daisyUI primitives only, or wrap in `$lib/components/ui/`?

Default: thin wrappers in `ui/` for repeated patterns.

---

## Phase 7 — Features (repeat per feature)

For each v1 feature, ask in order:

### 7.N.1 Feature scope

**Ask:** What does feature "[name]" do for the user?

### 7.N.2 Routes and files

**Ask:** Which routes, `+page.server.ts`, and components does it need?

### 7.N.3 Data

**Ask:** Schema changes or queries for this feature?

### 7.N.4 UI

**Ask:** Key screens and interactions?

After 7.N.4: write `feature-[name].mdc`, implement, then ask "Next feature or move to Phase 8?"

---

## Phase 8 — Polish

### 8.1 i18n scope

**Ask:** Which locales and what content is translated?

Only if Paraglide or i18n is in the stack.

### 8.2 Testing

**Ask:** What needs unit vs e2e tests for v1?

### 8.3 SEO

**Ask:** Which pages need meta tags, sitemap, or structured data?

### 8.4 Done check

**Ask:** Anything missing before v1 ship?

If user says finished → close workflow, set status `finished`.
