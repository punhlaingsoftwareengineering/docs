<script lang="ts">
	import { Pencil, Trash2 } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminFormTable from '$lib/components/admin/AdminFormTable.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import FormAlert from '$lib/components/FormAlert.svelte';
	import { confirmEnhance, formEnhance } from '$lib/utils/form-enhance';
	import type { PageData } from './$types';

	type FormState = {
		message?: string;
		success?: boolean;
		values?: Record<string, unknown>;
		errors?: Record<string, string[] | undefined>;
		action?: string;
		editId?: string;
	} | null;

	let { data, form }: { data: PageData; form: FormState } = $props();

	let editingId = $state<string | null>(null);

	let createName = $state('');
	let createSlug = $state('');
	let createSortOrder = $state(0);

	let editName = $state('');
	let editSlug = $state('');
	let editSortOrder = $state(0);

	$effect(() => {
		if (form?.action === 'create' && form.values) {
			createName = (form.values.name as string) ?? '';
			createSlug = (form.values.slug as string) ?? '';
			createSortOrder = Number(form.values.sortOrder ?? 0);
		}
	});

	$effect(() => {
		if (form?.action === 'update' && form.editId) {
			editingId = form.editId;
			editName = (form.values?.name as string) ?? '';
			editSlug = (form.values?.slug as string) ?? '';
			editSortOrder = Number(form.values?.sortOrder ?? 0);
		}
	});

	$effect(() => {
		if (!form?.success) return;

		if (form.action === 'create') {
			createName = '';
			createSlug = '';
			createSortOrder = data.categories.length;
		}

		if (form.action === 'update' || form.action === 'delete') {
			editingId = null;
		}
	});

	function startEdit(cat: PageData['categories'][number]) {
		editingId = cat.id;
		editName = cat.name;
		editSlug = cat.slug;
		editSortOrder = cat.sortOrder;
	}

	function cancelEdit() {
		editingId = null;
	}
</script>

<AdminHeader
	title="Categories"
	breadcrumbs={[{ label: 'Admin', href: resolve('/admin') }, { label: 'Categories' }]}
/>

<div class="flex min-w-0 flex-1 flex-col space-y-8 p-4 sm:p-6">
	<FormAlert {form} />

	<section class="w-full min-w-0 space-y-4">
		<h2 class="text-lg font-semibold">Add category</h2>
		<form method="POST" action="?/create" use:enhance={formEnhance} class="w-full min-w-0">
			<AdminFormTable>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="create-name"><span class="label-text">Name</span></label>
					</td>
					<td class="min-w-0 p-0">
						<input
							id="create-name"
							name="name"
							class="input input-bordered w-full"
							bind:value={createName}
							required
						/>
					</td>
					<td class="align-middle p-0">
						<label class="label py-0" for="create-slug"><span class="label-text">Slug</span></label>
					</td>
					<td class="min-w-0 p-0">
						<input
							id="create-slug"
							name="slug"
							class="input input-bordered w-full"
							bind:value={createSlug}
							placeholder="auto-from-name"
						/>
					</td>
				</tr>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="create-sort"
							><span class="label-text">Sort order</span></label
						>
					</td>
					<td class="min-w-0 p-0">
						<input
							id="create-sort"
							name="sortOrder"
							type="number"
							min="0"
							class="input input-bordered w-full"
							bind:value={createSortOrder}
						/>
					</td>
					<td class="p-0" aria-hidden="true"></td>
					<td class="min-w-0 p-0">
						<button type="submit" class="btn btn-primary">Add category</button>
					</td>
				</tr>
			</AdminFormTable>
		</form>
	</section>

	<section class="w-full min-w-0 space-y-4">
		<h2 class="text-lg font-semibold">All categories</h2>

		{#if data.categories.length === 0}
			<div
				class="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/60"
			>
				No categories yet. Add one above before creating documents.
			</div>
		{:else}
			<div class="overflow-x-auto rounded-box border border-base-300">
				<table class="table w-full">
					<thead>
						<tr>
							<th>Name</th>
							<th>Slug</th>
							<th>Sort</th>
							<th>Documents</th>
							<th class="w-40"></th>
						</tr>
					</thead>
					<tbody>
						{#each data.categories as cat (cat.id)}
							{#if editingId === cat.id}
								<tr>
									<td colspan="5" class="bg-base-200/50">
										<form
											method="POST"
											action="?/update"
											use:enhance={formEnhance}
											class="w-full min-w-0 py-2"
										>
											<input type="hidden" name="id" value={cat.id} />
											<AdminFormTable>
												<tr>
													<td class="align-middle p-0">
														<label class="label py-0" for="edit-name-{cat.id}"
															><span class="label-text">Name</span></label
														>
													</td>
													<td class="min-w-0 p-0">
														<input
															id="edit-name-{cat.id}"
															name="name"
															class="input input-bordered input-sm w-full"
															bind:value={editName}
															required
														/>
													</td>
													<td class="align-middle p-0">
														<label class="label py-0" for="edit-slug-{cat.id}"
															><span class="label-text">Slug</span></label
														>
													</td>
													<td class="min-w-0 p-0">
														<input
															id="edit-slug-{cat.id}"
															name="slug"
															class="input input-bordered input-sm w-full"
															bind:value={editSlug}
														/>
													</td>
												</tr>
												<tr>
													<td class="align-middle p-0">
														<label class="label py-0" for="edit-sort-{cat.id}"
															><span class="label-text">Sort order</span></label
														>
													</td>
													<td class="min-w-0 p-0">
														<input
															id="edit-sort-{cat.id}"
															name="sortOrder"
															type="number"
															min="0"
															class="input input-bordered input-sm w-full"
															bind:value={editSortOrder}
														/>
													</td>
													<td class="p-0" aria-hidden="true"></td>
													<td class="min-w-0 p-0">
														<div class="flex gap-2">
															<button type="submit" class="btn btn-primary btn-sm">Save</button>
															<button
																type="button"
																class="btn btn-ghost btn-sm"
																onclick={cancelEdit}
															>
																Cancel
															</button>
														</div>
													</td>
												</tr>
											</AdminFormTable>
										</form>
									</td>
								</tr>
							{:else}
								<tr class="hover">
									<td class="font-medium">{cat.name}</td>
									<td class="font-mono text-sm text-base-content/70">{cat.slug}</td>
									<td>{cat.sortOrder}</td>
									<td>{cat.documentCount}</td>
									<td>
										<div class="flex justify-end gap-1">
											<button
												type="button"
												class="btn btn-secondary btn-sm btn-square shrink-0"
												aria-label="Edit {cat.name}"
												onclick={() => startEdit(cat)}
											>
												<Pencil class="h-4 w-4" aria-hidden="true" />
											</button>
											<form
												method="POST"
												action="?/delete"
												use:enhance={confirmEnhance(() => `Delete "${cat.name}"?`)}
											>
												<input type="hidden" name="id" value={cat.id} />
												<button
													type="submit"
													class="btn btn-error btn-sm btn-square shrink-0"
													aria-label="Delete {cat.name}"
													disabled={cat.documentCount > 0}
													title={cat.documentCount > 0
														? 'Move or delete documents in this category first'
														: 'Delete category'}
												>
													<Trash2 class="h-4 w-4" aria-hidden="true" />
												</button>
											</form>
										</div>
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>
