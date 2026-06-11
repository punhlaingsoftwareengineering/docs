<script lang="ts">
	import { resolve } from '$app/paths';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

	let { data } = $props();
</script>

<AdminHeader
	title="Documents"
	breadcrumbs={[
		{ label: 'Admin', href: resolve('/admin') },
		{ label: 'Documents' }
	]}
/>

<div class="flex-1 space-y-4 p-6">
	<div class="flex flex-wrap items-center gap-3">
		<form method="GET" class="flex flex-1 flex-wrap gap-2">
			<input
				type="search"
				name="q"
				value={data.search}
				placeholder="Search documents…"
				class="input input-bordered input-sm w-full max-w-xs"
			/>
			<select name="filter" class="select select-bordered select-sm" value={data.filter}>
				<option value="all">All</option>
				<option value="published">Published</option>
				<option value="draft">Drafts</option>
			</select>
			<select name="sort" class="select select-bordered select-sm" value={data.sort}>
				<option value="updated">Last updated</option>
				<option value="title">Title A–Z</option>
				<option value="category">Category</option>
			</select>
			<button type="submit" class="btn btn-sm btn-outline">Apply</button>
		</form>
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
								<a href={resolve(`/admin/documents/${doc.id}`)} class="btn btn-ghost btn-xs">Edit</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
