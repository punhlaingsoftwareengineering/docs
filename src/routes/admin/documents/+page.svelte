<script lang="ts">
	import { Pencil, Trash2 } from '@lucide/svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

	let { data } = $props();

	let search = $state('');
	let syncedSearch = $state('');
	let deletingId = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);

	$effect(() => {
		if (data.search !== syncedSearch) {
			search = data.search;
			syncedSearch = data.search;
		}
	});

	function updateFilters(updates: { q?: string; filter?: string; sort?: string }) {
		const params = new URLSearchParams(page.url.searchParams);

		if (updates.q !== undefined) {
			search = updates.q;
			syncedSearch = updates.q;
			if (updates.q.trim()) params.set('q', updates.q);
			else params.delete('q');
		}
		if (updates.filter !== undefined) {
			params.set('filter', updates.filter);
		}
		if (updates.sort !== undefined) {
			params.set('sort', updates.sort);
		}

		goto(`?${params}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	async function deleteDocument(id: string, title: string) {
		if (!confirm(`Delete "${title}"?`)) return;

		deletingId = id;
		errorMessage = null;

		const response = await fetch(resolve(`/admin/api/documents/${id}`), { method: 'DELETE' });

		deletingId = null;

		if (!response.ok) {
			errorMessage = 'Could not delete document.';
			return;
		}

		await invalidateAll();
	}
</script>

<AdminHeader
	title="Documents"
	breadcrumbs={[
		{ label: 'Admin', href: resolve('/admin') },
		{ label: 'Documents' }
	]}
/>

<div class="flex-1 space-y-4 p-6">
	{#if errorMessage}
		<div class="alert alert-error" role="alert">
			<span>{errorMessage}</span>
		</div>
	{/if}

	<div class="flex flex-wrap items-center gap-3">
		<div class="flex flex-1 flex-wrap gap-2">
			<input
				type="search"
				name="q"
				value={search}
				placeholder="Search documents…"
				class="input input-bordered input-sm w-full max-w-xs"
				oninput={(e) => updateFilters({ q: e.currentTarget.value })}
			/>
			<select
				name="filter"
				class="select select-bordered select-sm"
				value={data.filter}
				onchange={(e) => updateFilters({ filter: e.currentTarget.value })}
			>
				<option value="all">All</option>
				<option value="published">Published</option>
				<option value="draft">Drafts</option>
			</select>
			<select
				name="sort"
				class="select select-bordered select-sm"
				value={data.sort}
				onchange={(e) => updateFilters({ sort: e.currentTarget.value })}
			>
				<option value="updated">Last updated</option>
				<option value="title">Title A–Z</option>
				<option value="category">Category</option>
			</select>
		</div>
		<a href={resolve('/admin/documents/new')} class="btn btn-primary btn-sm">New document</a>
	</div>

	{#if data.documents.length === 0}
		<div class="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/60">
			No documents match your filters.
		</div>
	{:else}
		<div class="overflow-x-auto rounded-box border border-base-300">
			<table class="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Level</th>
						<th>Category</th>
						<th>Status</th>
						<th>Updated</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each data.documents as doc (doc.id)}
						<tr class="hover">
							<td class="font-medium">{doc.title}</td>
							<td>
								<span class="badge badge-info badge-sm">Level {doc.depth}</span>
							</td>
							<td class="text-sm text-base-content/70">{doc.categoryName}</td>
							<td>
								{#if doc.published}
									<span class="badge badge-success badge-sm">Published</span>
								{:else}
									<span class="badge badge-warning badge-sm">Draft</span>
								{/if}
							</td>
							<td class="text-sm text-base-content/60">
								{new Date(doc.updatedAt).toLocaleDateString()}
							</td>
							<td>
								<div class="flex justify-end gap-1">
									<a
										href={resolve(`/admin/documents/${doc.id}`)}
										class="btn btn-secondary btn-sm btn-square shrink-0"
										aria-label="Edit {doc.title}"
									>
										<Pencil class="h-4 w-4" aria-hidden="true" />
									</a>
									<button
										type="button"
										class="btn btn-error btn-sm btn-square shrink-0"
										aria-label="Delete {doc.title}"
										disabled={deletingId !== null}
										onclick={() => deleteDocument(doc.id, doc.title)}
									>
										<Trash2 class="h-4 w-4" aria-hidden="true" />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
