# Cursor rule templates

Write rules to this project's `.cursor/rules/`. One concern per file, under ~50 lines.

Do not duplicate `project-stack.mdc`, `svelte5-sveltekit2.mdc`, or other framework rules — add app-specific rules only.

---

## Always-apply app structure

**File:** `.cursor/rules/app-structure.mdc`

```markdown
---
description: App purpose, audience, and structural conventions
alwaysApply: true
---

# App structure

## Purpose

[One sentence from Phase 0.2]

## Audience

[From Phase 0.2]

## v1 primary action

[From Phase 0.3]

## Folder conventions

- `src/lib/components/` — shared UI
- `src/lib/schemas/` — Zod schemas
- `src/lib/server/services/` — domain logic
```

---

## Route-specific

**File:** `.cursor/rules/routing.mdc`

```markdown
---
description: Route map and layout conventions
globs: src/routes/**
alwaysApply: false
---

# Routing

## URL map

| Path           | Layout    | Auth   |
| -------------- | --------- | ------ |
| `/`            | marketing | public |
| `/docs/[slug]` | docs      | public |

## Groups

- `(marketing)` — public marketing pages
- `(app)` — authenticated shell

## Conventions

- Use `resolve()` from `$app/paths` for internal links
- Protected routes redirect to `/login` when `!event.locals.user`
```

---

## Data model

**File:** `.cursor/rules/data-model.mdc`

```markdown
---
description: Drizzle schema and ID conventions
globs: src/lib/server/db/**
alwaysApply: false
---

# Data model

## IDs

- User-facing entities: `uuid().primaryKey().defaultRandom()`
- Internal join tables: serial OK

## Tables

- `document` — user docs, `id`, `title`, `userId`, `createdAt`

## Migrations

- Use `npm run db:generate` then `db:migrate` for schema changes
```

---

## Feature-specific

**File:** `.cursor/rules/feature-docs.mdc`

```markdown
---
description: Documentation pages feature
globs: src/routes/**/docs/**,src/lib/**/docs/**
alwaysApply: false
---

# Feature: docs

## Scope

MDX/markdown docs rendered at `/docs/[slug]`.

## Files

- `src/routes/docs/[slug]/+page.server.ts` — load content
- `src/lib/components/docs/DocLayout.svelte` — doc shell

## Rules

- Content from `content/docs/` or DB — [pick one]
- Slug validated with `z.string().min(1)`
```

---

## Naming conventions

| Pattern                    | Use when                          |
| -------------------------- | --------------------------------- |
| `app-structure.mdc`        | Purpose, audience, global folders |
| `routing.mdc`              | URL map, layouts, auth per route  |
| `data-model.mdc`           | Drizzle tables and IDs            |
| `feature-[kebab-name].mdc` | One v1 feature                    |
| `ui-shell.mdc`             | daisyUI layout, themes, nav       |

## Frontmatter rules

- `description` — shown in rule picker; be specific
- `alwaysApply: true` — only for whole-app rules (1–2 files max)
- `globs` — file-specific; use `src/routes/**` style paths
- Keep body actionable with tables and bullet lists, not prose essays
