<script lang="ts">

	import { enhance } from '$app/forms';

	import { resolve } from '$app/paths';

	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';

	import MarkdownEditor from '$lib/components/admin/MarkdownEditor.svelte';

	import FormAlert from '$lib/components/FormAlert.svelte';

	import { formEnhance } from '$lib/utils/form-enhance';
	import type { PageData } from './$types';

	type FormState = {
		message?: string;
		success?: boolean;
		values?: Record<string, unknown>;
		errors?: Record<string, string[] | undefined>;
	} | null;

	let { data, form }: { data: PageData; form: FormState } = $props();



	let content = $state(data.doc.content);

	let title = $state((form?.values?.title as string) ?? data.doc.title);

	let slug = $state((form?.values?.slug as string) ?? data.doc.slug);

	let excerpt = $state((form?.values?.excerpt as string) ?? data.doc.excerpt ?? '');

	let tags = $state((form?.values?.tags as string) ?? data.doc.tags);

	let categoryId = $state((form?.values?.categoryId as string) ?? data.doc.categoryId);

	let published = $state(data.doc.published);

	let parentDocumentId = $state((form?.values?.parentDocumentId as string) ?? data.doc.parentDocumentId ?? '');

	let sortOrder = $state(data.doc.sortOrder ?? 0);



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



<div class="flex-1 space-y-4 p-6">

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



	<form method="POST" action="?/save" use:enhance={formEnhance} class="space-y-4">

		<div class="grid gap-4 lg:grid-cols-2">

			<div class="form-control">

				<label class="label" for="title"><span class="label-text">Title</span></label>

				<input id="title" name="title" class="input input-bordered" bind:value={title} required />

				{#if form?.errors && 'title' in form.errors && form.errors.title}

					<p class="mt-1 text-sm text-error">{form.errors.title[0]}</p>

				{/if}

			</div>

			<div class="form-control">

				<label class="label" for="slug"><span class="label-text">Slug</span></label>

				<input id="slug" name="slug" class="input input-bordered" bind:value={slug} />

			</div>

		</div>



		<div class="grid gap-4 lg:grid-cols-3">

			<div class="form-control">

				<label class="label" for="categoryId"><span class="label-text">Category</span></label>

				<select

					id="categoryId"

					name="categoryId"

					class="select select-bordered"

					bind:value={categoryId}

					onchange={() => (parentDocumentId = '')}

					required

				>

					{#each data.categories as cat (cat.id)}

						<option value={cat.id}>{cat.name}</option>

					{/each}

				</select>

			</div>

			<div class="form-control">

				<label class="label" for="parentDocumentId"><span class="label-text">Parent page (optional)</span></label>

				<select id="parentDocumentId" name="parentDocumentId" class="select select-bordered" bind:value={parentDocumentId}>

					<option value="">None (top level)</option>

					{#each parentOptions as parent (parent.id)}

						<option value={parent.id}>{parent.label}</option>

					{/each}

				</select>

			</div>

			<div class="form-control">

				<label class="label" for="sortOrder"><span class="label-text">Sort order</span></label>

				<input

					id="sortOrder"

					name="sortOrder"

					type="number"

					min="0"

					class="input input-bordered"

					bind:value={sortOrder}

				/>

			</div>

			<div class="form-control">

				<label class="label" for="tags"><span class="label-text">Tags</span></label>

				<input id="tags" name="tags" class="input input-bordered" bind:value={tags} />

			</div>

			<div class="form-control">

				<label class="label cursor-pointer justify-start gap-3 pt-8">

					<input type="checkbox" class="checkbox" bind:checked={published} />

					<span class="label-text">Published</span>

				</label>

				<input type="hidden" name="published" value={published ? 'true' : 'false'} />

			</div>

		</div>



		<div class="form-control">

			<label class="label" for="excerpt"><span class="label-text">Excerpt</span></label>

			<textarea id="excerpt" name="excerpt" class="textarea textarea-bordered" rows="2" bind:value={excerpt}></textarea>

		</div>



		<input type="hidden" name="content" value={content} />

		<div class="form-control">

			<p class="label"><span class="label-text">Content (Markdown)</span></p>

			<MarkdownEditor bind:value={content} />

		</div>



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

		<form

			method="POST"

			action="?/delete"

			use:enhance={formEnhance}

			onsubmit={(e) => !confirm('Delete this document?') && e.preventDefault()}

		>

			<button type="submit" class="btn btn-error btn-outline btn-sm">Delete</button>

		</form>

	</div>

</div>

