<script lang="ts">
	import { resolve } from '$app/paths';
	import DocumentOrderPanel from '$lib/components/admin/DocumentOrderPanel.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

	let { data } = $props();
</script>

<AdminHeader title="Dashboard" />

<div class="flex min-w-0 flex-1 flex-col space-y-6 p-4 sm:p-6">
	<div class="grid gap-4 sm:grid-cols-3">
		<div class="stat rounded-box border border-base-300 bg-base-100">
			<div class="stat-title">Total documents</div>
			<div class="stat-value text-primary">{data.stats.total}</div>
		</div>
		<div class="stat rounded-box border border-base-300 bg-base-100">
			<div class="stat-title">Published</div>
			<div class="stat-value text-success">{data.stats.published}</div>
		</div>
		<div class="stat rounded-box border border-base-300 bg-base-100">
			<div class="stat-title">Drafts</div>
			<div class="stat-value text-warning">{data.stats.drafts}</div>
		</div>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2">
		<h2 class="text-lg font-semibold">Categories</h2>
		<a href={resolve('/admin/categories')} class="btn btn-ghost btn-sm">Manage categories</a>
	</div>

	{#if data.categories.length === 0}
		<div
			class="rounded-box border border-dashed border-base-300 p-6 text-center text-base-content/60"
		>
			No categories yet.
			<a href={resolve('/admin/categories')} class="link font-medium">Create your first category</a>
			before adding documents.
		</div>
	{:else}
		<div class="overflow-x-auto rounded-box border border-base-300">
			<table class="table table-sm w-full">
				<thead>
					<tr>
						<th>Name</th>
						<th>Slug</th>
						<th>Documents</th>
					</tr>
				</thead>
				<tbody>
					{#each data.categories as cat (cat.id)}
						<tr>
							<td class="font-medium">{cat.name}</td>
							<td class="font-mono text-sm text-base-content/70">{cat.slug}</td>
							<td>{cat.documentCount}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<div class="flex flex-wrap items-center justify-between gap-2">
		<div>
			<h2 class="text-lg font-semibold">Document order</h2>
			<p class="text-sm text-base-content/60">
				Drag pages to reorder within the same parent. Order cannot move across categories.
			</p>
		</div>
		<a href={resolve('/admin/documents/new')} class="btn btn-primary btn-sm">New document</a>
	</div>

	{#if data.orderGroups.every((group) => group.items.length === 0)}
		<div
			class="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/60"
		>
			No documents yet. Create your first one.
		</div>
	{:else}
		<DocumentOrderPanel groups={data.orderGroups} />
	{/if}
</div>
