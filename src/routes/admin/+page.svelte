<script lang="ts">
	import { resolve } from '$app/paths';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

	let { data } = $props();
</script>

<AdminHeader title="Dashboard" />

<div class="flex-1 space-y-6 p-6">
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

	<div class="flex items-center justify-between">
		<h2 class="text-lg font-semibold">Recent edits</h2>
		<a href={resolve('/admin/documents/new')} class="btn btn-primary btn-sm">New document</a>
	</div>

	{#if data.recent.length === 0}
		<div class="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/60">
			No documents yet. Create your first one.
		</div>
	{:else}
		<div class="overflow-x-auto rounded-box border border-base-300">
			<table class="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Status</th>
						<th>Updated</th>
					</tr>
				</thead>
				<tbody>
					{#each data.recent as doc (doc.id)}
						<tr class="hover">
							<td>
								<a href={resolve(`/admin/documents/${doc.id}`)} class="link link-hover font-medium">
									{doc.title}
								</a>
							</td>
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
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
