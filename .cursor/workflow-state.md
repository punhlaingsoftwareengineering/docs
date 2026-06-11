# Workflow state

- **Project:** docs.zarnihlawn.com
- **Phase:** 9 (complete)
- **Status:** full admin setup implemented

## Decisions (locked)

- Content: **database only** (Postgres via Drizzle)
- Editor: **CodeMirror** split pane, manual save
- Categories: fixed set (Getting Started, Guides, Reference, Examples, Changelog)
- Slug: auto from title with manual override
- Admin sidebar: fixed left
- List sort default: last updated
- Unpublished docs: 404 for visitors; draft preview for logged-in admin
- Demo routes: removed

## Rules

- `app-structure.mdc`, `routing.mdc`, `data-model.mdc`
- `feature-admin.mdc`, `feature-docs.mdc`

## DB scripts

- `pnpm run db:ensure` — create CMS tables (non-interactive)
- `pnpm run db:seed` — seed categories, site_settings, sample docs
- `pnpm exec drizzle-kit push --force` — interactive; use db:ensure if push prompts fail

## Admin routes

| Path | Purpose |
|------|---------|
| `/admin` | Dashboard stats |
| `/admin/documents` | Document list |
| `/admin/documents/new` | Create document |
| `/admin/documents/[id]` | CodeMirror editor |
| `/admin/settings` | Site, landing, defaults, account |
