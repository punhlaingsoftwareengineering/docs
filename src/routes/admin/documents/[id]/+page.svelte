<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminFormTable from '$lib/components/admin/AdminFormTable.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import MarkdownEditor from '$lib/components/admin/MarkdownEditor.svelte';
	import FormAlert from '$lib/components/FormAlert.svelte';
	import { confirmEnhance, formEnhance } from '$lib/utils/form-enhance';
	import type { PageData } from './$types';

	type FormState = {
		message?: string;
		success?: boolean;
		values?: Record<string, unknown>;
		errors?: Record<string, string[] | undefined>;
	} | null;

	let { data, form }: { data: PageData; form: FormState } = $props();

	let content = $state('');
	let title = $state('');
	let slug = $state('');
	let excerpt = $state('');
	let tags = $state('');
	let categoryId = $state('');
	let published = $state(false);
	let parentDocumentId = $state('');
	let initialized = $state(false);

	$effect(() => {
		const values = form?.values;
		if (values) {
			title = (values.title as string) ?? title;
			slug = (values.slug as string) ?? slug;
			excerpt = (values.excerpt as string) ?? excerpt;
			tags = (values.tags as string) ?? tags;
			categoryId = (values.categoryId as string) ?? categoryId;
			parentDocumentId = (values.parentDocumentId as string) ?? parentDocumentId;
			return;
		}

		if (!initialized) {
			content = data.doc.content;
			title = data.doc.title;
			slug = data.doc.slug;
			excerpt = data.doc.excerpt ?? '';
			tags = data.doc.tags;
			categoryId = data.doc.categoryId;
			published = data.doc.published;
			parentDocumentId = data.doc.parentDocumentId ?? '';
			initialized = true;
		}
	});

	const parentOptions = $derived(data.parentOptionsByCategory[categoryId] ?? []);
</script>

<AdminHeader
	title={data.doc.title}
	breadcrumbs={[
		{ label: 'Admin', href: resolve('/admin') },
		{ label: 'Documents', href: resolve('/admin/documents') },
		{ label: data.doc.title }
	]}
/>

<div class="flex min-w-0 flex-1 flex-col space-y-4 p-6">
	<FormAlert {form} />

	<div class="flex flex-wrap items-center gap-2">
		{#if data.doc.published}
			<span class="badge badge-success">Published</span>
			<a href={resolve(`/docs/${data.doc.slug}`)} class="btn btn-ghost btn-xs" target="_blank">View public</a>
		{:else}
			<span class="badge badge-warning">Draft</span>
		{/if}
		<span class="badge badge-info">Level {data.depth}</span>
		{#if data.hasChildren}
			<span class="badge badge-secondary">Has children</span>
		{/if}
	</div>

	<form method="POST" action="?/save" use:enhance={formEnhance} class="flex w-full min-w-0 flex-col space-y-8">
		<section class="w-full min-w-0 space-y-4">
			<h2 class="text-lg font-semibold">Details</h2>
			<AdminFormTable>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="title"><span class="label-text">Title</span></label>
					</td>
					<td class="min-w-0 p-0">
						<input id="title" name="title" class="input input-bordered w-full" bind:value={title} required />
						{#if form?.errors && 'title' in form.errors && form.errors.title}
							<p class="mt-1 text-sm text-error">{form.errors.title[0]}</p>
						{/if}
					</td>
					<td class="align-middle p-0">
						<label class="label py-0" for="slug"><span class="label-text">Slug</span></label>
					</td>
					<td class="min-w-0 p-0">
						<input id="slug" name="slug" class="input input-bordered w-full" bind:value={slug} />
					</td>
				</tr>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="categoryId"><span class="label-text">Category</span></label>
					</td>
					<td class="min-w-0 p-0">
						<select
							id="categoryId"
							name="categoryId"
							class="select select-bordered w-full"
							bind:value={categoryId}
							onchange={() => (parentDocumentId = '')}
							required
						>
							{#each data.categories as cat (cat.id)}
								<option value={cat.id}>{cat.name}</option>
							{/each}
						</select>
					</td>
					<td class="align-middle p-0">
						<label class="label py-0" for="parentDocumentId"
							><span class="label-text">Parent page</span></label
						>
					</td>
					<td class="min-w-0 p-0">
						<select
							id="parentDocumentId"
							name="parentDocumentId"
							class="select select-bordered w-full"
							bind:value={parentDocumentId}
						>
							<option value="">None (top level)</option>
							{#each parentOptions as parent (parent.id)}
								<option value={parent.id}>{parent.label}</option>
							{/each}
						</select>
					</td>
				</tr>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="tags"><span class="label-text">Tags</span></label>
					</td>
					<td class="min-w-0 p-0">
						<input id="tags" name="tags" class="input input-bordered w-full" bind:value={tags} />
					</td>
					<td class="align-middle p-0">
						<span class="label py-0"><span class="label-text">Published</span></span>
					</td>
					<td class="min-w-0 p-0">
						<label class="label cursor-pointer justify-start gap-3 py-0">
							<input type="checkbox" class="checkbox" bind:checked={published} />
						</label>
						<input type="hidden" name="published" value={published ? 'true' : 'false'} />
					</td>
				</tr>
				<tr>
					<td class="align-top p-0 pt-3">
						<label class="label py-0" for="excerpt"><span class="label-text">Excerpt</span></label>
					</td>
					<td class="min-w-0 p-0" colspan="3">
						<textarea
							id="excerpt"
							name="excerpt"
							class="textarea textarea-bordered w-full"
							rows="2"
							bind:value={excerpt}
						></textarea>
					</td>
				</tr>
			</AdminFormTable>
		</section>

		<section class="w-full min-w-0 space-y-4">
			<h2 class="text-lg font-semibold">Content</h2>
			<input type="hidden" name="content" value={content} />
			<MarkdownEditor bind:value={content} />
		</section>

		<div class="flex flex-wrap gap-2">
			<button type="submit" class="btn btn-primary">Save</button>
		</div>
	</form>

	<div class="flex flex-wrap gap-2 border-t border-base-300 pt-4">
		<form method="POST" action="?/publish" use:enhance={formEnhance}>
			<button type="submit" class="btn btn-outline btn-sm">
				{data.doc.published ? 'Unpublish' : 'Publish'}
			</button>
		</form>
		<form method="POST" action="?/delete" use:enhance={confirmEnhance('Delete this document?')}>
			<button type="submit" class="btn btn-error btn-outline btn-sm">Delete</button>
		</form>
	</div>
</div>
