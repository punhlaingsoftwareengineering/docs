---
name: admin-form-table
description: >-
  Builds admin forms with the invisible 4-column table layout (AdminFormTable).
  Use when adding or editing admin forms, settings pages, CRUD fields, aligning
  labels/inputs in columns, or when the user mentions table-style forms, invisible
  table, or AdminFormTable.
---

# Admin form table layout

## When to use

- Any multi-field form under `src/routes/admin/` or `src/lib/components/admin/`
- User asks for aligned labels, table-style forms, or matching Settings/Categories layout

## Component

Always wrap field rows in `AdminFormTable`:

```svelte
import AdminFormTable from '$lib/components/admin/AdminFormTable.svelte';

<form class="flex w-full min-w-0 flex-col space-y-8">
	<section class="w-full min-w-0 space-y-4">
		<h2 class="text-lg font-semibold">Section title</h2>
		<AdminFormTable>
			<!-- <tr> rows here -->
		</AdminFormTable>
	</section>
</form>
```

## Column rules

| Col 1   | Col 2   | Col 3   | Col 4   |
| ------- | ------- | ------- | ------- |
| Label A | Field A | Label B | Field B |

- **Never** put one field across cols 2–3 with `colspan="2"` — that breaks vertical alignment.
- **Full width**: label col 1, `td.colspan="3"` for textarea/input.
- **Second-pair action** (button): cols 1–2 filled or `colspan="2" aria-hidden`, button in col 4.
- **Second-pair checkbox**: `colspan="2" aria-hidden`, "Published" label col 3, checkbox col 4.

## Row templates

**Two fields (standard row):**

```svelte
<tr>
	<td class="align-middle p-0">
		<label class="label py-0" for="title"><span class="label-text">Title</span></label>
	</td>
	<td class="min-w-0 p-0">
		<input id="title" name="title" class="input input-bordered w-full" />
	</td>
	<td class="align-middle p-0">
		<label class="label py-0" for="slug"><span class="label-text">Slug</span></label>
	</td>
	<td class="min-w-0 p-0">
		<input id="slug" name="slug" class="input input-bordered w-full" />
	</td>
</tr>
```

**Sort order + action under second column:**

```svelte
<tr>
	<td class="align-middle p-0">
		<label class="label py-0" for="sortOrder"><span class="label-text">Sort order</span></label>
	</td>
	<td class="min-w-0 p-0">
		<input id="sortOrder" name="sortOrder" type="number" class="input input-bordered w-full" />
	</td>
	<td class="p-0" aria-hidden="true"></td>
	<td class="min-w-0 p-0">
		<button type="submit" class="btn btn-primary">Add category</button>
	</td>
</tr>
```

**Full-width excerpt:**

```svelte
<tr>
	<td class="align-top p-0 pt-3">
		<label class="label py-0" for="excerpt"><span class="label-text">Excerpt</span></label>
	</td>
	<td class="min-w-0 p-0" colspan="3">
		<textarea id="excerpt" name="excerpt" class="textarea textarea-bordered w-full" rows="2"
		></textarea>
	</td>
</tr>
```

## Width

- Remove `max-w-6xl` from admin form tables.
- Page shell: `flex min-w-0 flex-1 flex-col`; forms: `w-full min-w-0`.
- All inputs/selects/textareas: `w-full`.

## Anti-patterns

```svelte
<!-- BAD: 3 fields in one row -->
<tr>
	<td>Category</td><td>...</td>
	<td>Parent</td><td>...</td>
	<td>Sort</td><td>...</td>
	<!-- breaks column grid -->
</tr>

<!-- BAD: field spans two data columns -->
<td class="p-0" colspan="2"><input class="w-full" /></td>

<!-- BAD: grid layout for admin multi-field forms -->
<div class="grid gap-4 lg:grid-cols-3">...</div>
```

## Canonical examples in repo

- `src/routes/admin/settings/+page.svelte`
- `src/routes/admin/categories/+page.svelte`
- `src/routes/admin/documents/new/+page.svelte`
- `src/routes/admin/documents/[id]/+page.svelte`
- `src/lib/components/admin/AdminFormTable.svelte`

## Checklist

- [ ] Uses `AdminFormTable`, not raw table or CSS grid
- [ ] Each field occupies exactly one label cell + one field cell
- [ ] Columns align vertically across rows
- [ ] Form stretches full content width
- [ ] `npm run check` passes after edits
