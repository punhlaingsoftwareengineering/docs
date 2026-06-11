<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import AdminHeader from '$lib/components/admin/AdminHeader.svelte';
	import MarkdownEditor from '$lib/components/admin/MarkdownEditor.svelte';

	let { data, form } = $props();

	let content = $state('');
	let title = $state((form?.values?.title as string) ?? '');
	let slug = $state((form?.values?.slug as string) ?? '');
	let excerpt = $state((form?.values?.excerpt as string) ?? '');
	let tags = $state((form?.values?.tags as string) ?? '');
	let categoryId = $state((form?.values?.categoryId as string) ?? data.categories[0]?.id ?? '');
	let published = $state(data.defaultPublished);
</script>

<AdminHeader
	title="New document"
	breadcrumbs={[
		{ label: 'Admin', href: resolve('/admin') },
		{ label: 'Documents', href: resolve('/admin/documents') },
		{ label: 'New' }
	]}
/>

<div class="flex-1 p-6">
	<form method="POST" use:enhance class="space-y-4">
		<div class="grid gap-4 lg:grid-cols-2">
			<div class="form-control">
				<label class="label" for="title"><span class="label-text">Title</span></label>
				<input id="title" name="title" class="input input-bordered" bind:value={title} required />
				{#if form?.errors?.title}
					<p class="mt-1 text-sm text-error">{form.errors.title[0]}</p>
				{/if}
			</div>
			<div class="form-control">
				<label class="label" for="slug"><span class="label-text">Slug (optional)</span></label>
				<input id="slug" name="slug" class="input input-bordered" bind:value={slug} placeholder="auto-from-title" />
			</div>
		</div>

		<div class="grid gap-4 lg:grid-cols-3">
			<div class="form-control">
				<label class="label" for="categoryId"><span class="label-text">Category</span></label>
				<select id="categoryId" name="categoryId" class="select select-bordered" bind:value={categoryId} required>
					{#each data.categories as cat (cat.id)}
						<option value={cat.id}>{cat.name}</option>
					{/each}
				</select>
			</div>
			<div class="form-control">
				<label class="label" for="tags"><span class="label-text">Tags (comma-separated)</span></label>
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
		<MarkdownEditor bind:value={content} />

		<div class="flex gap-2">
			<button type="submit" class="btn btn-primary">Create document</button>
			<a href={resolve('/admin/documents')} class="btn btn-ghost">Cancel</a>
		</div>
	</form>
</div>
