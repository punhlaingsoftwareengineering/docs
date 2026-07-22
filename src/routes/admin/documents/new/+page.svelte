<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminFormTable from '$lib/components/admin/AdminFormTable.svelte';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import DocumentContentSection from '$lib/components/admin/DocumentContentSection.svelte';
	import FormAlert from '$lib/components/FormAlert.svelte';
	import {
		DEFAULT_DOCUMENT_CONTENT_TYPE,
		type DocumentContentType
	} from '$lib/constants/document-content';
	import { formEnhance } from '$lib/utils/form-enhance';
	import type { PageData } from './$types';

	type FormState = {
		message?: string;
		values?: Record<string, unknown>;
		errors?: Record<string, string[] | undefined>;
	} | null;

	let { data, form }: { data: PageData; form: FormState } = $props();

	let content = $state('');
	let contentType = $state<DocumentContentType>(DEFAULT_DOCUMENT_CONTENT_TYPE);
	let mediaUrl = $state('');
	let title = $state('');
	let excerpt = $state('');
	let tags = $state('');
	let categoryId = $state('');
	let published = $state(false);
	let parentDocumentId = $state('');
	let initialized = $state(false);

	$effect(() => {
		const values = form?.values;
		if (values) {
			title = (values.title as string) ?? '';
			excerpt = (values.excerpt as string) ?? '';
			tags = (values.tags as string) ?? '';
			content = (values.content as string) ?? '';
			contentType = (values.contentType as DocumentContentType) ?? DEFAULT_DOCUMENT_CONTENT_TYPE;
			mediaUrl = (values.mediaUrl as string) ?? '';
			categoryId = (values.categoryId as string) ?? categoryId;
			parentDocumentId = (values.parentDocumentId as string) ?? '';
			return;
		}

		if (!initialized) {
			published = data.defaultPublished;
			if (data.categories[0]?.id) {
				categoryId = data.categories[0].id;
			}
			initialized = true;
		}
	});

	const parentOptions = $derived(data.parentOptionsByCategory[categoryId] ?? []);
	const hasCategories = $derived(data.categories.length > 0);
</script>

<AdminHeader
	title="New document"
	breadcrumbs={[
		{ label: 'Admin', href: resolve('/admin') },
		{ label: 'Documents', href: resolve('/admin/documents') },
		{ label: 'New' }
	]}
/>

<div class="flex min-w-0 flex-1 flex-col space-y-6 p-4 sm:p-6">
	<FormAlert {form} />

	{#if !hasCategories}
		<div class="alert alert-warning" role="alert">
			<span>
				You need at least one category before creating a document.
				<a href={resolve('/admin/categories')} class="link font-medium">Manage categories</a>
			</span>
		</div>
	{/if}

	<form method="POST" use:enhance={formEnhance} class="flex w-full min-w-0 flex-col space-y-8">
		<section class="w-full min-w-0 space-y-4">
			<h2 class="text-lg font-semibold">Details</h2>
			<AdminFormTable>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="title"><span class="label-text">Title</span></label>
					</td>
					<td class="min-w-0 p-0" colspan="3">
						<input
							id="title"
							name="title"
							class="input input-bordered w-full"
							bind:value={title}
							required
							disabled={!hasCategories}
						/>
						{#if form?.errors?.title}
							<p class="mt-1 text-sm text-error">{form.errors.title[0]}</p>
						{/if}
					</td>
				</tr>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="categoryId"
							><span class="label-text">Category</span></label
						>
					</td>
					<td class="min-w-0 p-0">
						<select
							id="categoryId"
							name="categoryId"
							class="select select-bordered w-full"
							bind:value={categoryId}
							onchange={() => (parentDocumentId = '')}
							required
							disabled={!hasCategories}
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
							disabled={!hasCategories}
						>
							<option value="">None (top level)</option>
							{#each parentOptions as parent (parent.id)}
								<option value={parent.id}>{parent.label}</option>
							{/each}
						</select>
						{#if form?.errors?.parentDocumentId}
							<p class="mt-1 text-sm text-error">{form.errors.parentDocumentId[0]}</p>
						{/if}
					</td>
				</tr>
				<tr>
					<td class="align-middle p-0">
						<label class="label py-0" for="tags"><span class="label-text">Tags</span></label>
					</td>
					<td class="min-w-0 p-0">
						<input
							id="tags"
							name="tags"
							class="input input-bordered w-full"
							bind:value={tags}
							placeholder="comma-separated"
							disabled={!hasCategories}
						/>
					</td>
					<td class="align-middle p-0">
						<span class="label py-0"><span class="label-text">Published</span></span>
					</td>
					<td class="min-w-0 p-0">
						<label class="label cursor-pointer justify-start gap-3 py-0">
							<input
								type="checkbox"
								class="checkbox"
								bind:checked={published}
								disabled={!hasCategories}
							/>
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
							disabled={!hasCategories}></textarea>
					</td>
				</tr>
			</AdminFormTable>
		</section>

		<section class="w-full min-w-0 space-y-4">
			<h2 class="text-lg font-semibold">Content</h2>
			<DocumentContentSection
				bind:content
				bind:contentType
				bind:mediaUrl
				{excerpt}
				disabled={!hasCategories}
				mediaUrlError={form?.errors?.mediaUrl?.[0]}
			/>
		</section>

		<div class="flex gap-2">
			<button type="submit" class="btn btn-primary" disabled={!hasCategories}
				>Create document</button
			>
			<a href={resolve('/admin/documents')} class="btn btn-ghost">Cancel</a>
		</div>
	</form>
</div>
