<script lang="ts">
	import { resolve } from '$app/paths';
	import DocsBreadcrumbs from '$lib/components/docs/DocsBreadcrumbs.svelte';
	import DocMediaViewer from '$lib/components/docs/DocMediaViewer.svelte';
	import DocsPageShell from '$lib/components/docs/DocsPageShell.svelte';
	import DocsPrevNext from '$lib/components/docs/DocsPrevNext.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import { slugify } from '$lib/utils/slug';

	let { data } = $props();
	const titleId = $derived(slugify(data.doc.title));
</script>

<PageTitle title={data.doc.title} appName={data.site.appName} />

<DocsPageShell
	appName={data.site.appName}
	sidebarGroups={data.sidebarGroups}
	currentSlug={data.doc.slug}
	currentCategorySlug={data.doc.categorySlug}
>
	{#snippet breadcrumbs()}
		<DocsBreadcrumbs
			categoryName={data.doc.categoryName}
			categorySlug={data.doc.categorySlug}
			ancestors={data.ancestors}
			currentTitle={data.doc.title}
		/>
	{/snippet}

	{#if data.isPreview}
		<div class="not-prose alert alert-warning mb-6">
			<span>Draft preview — this page is not visible to visitors.</span>
		</div>
	{/if}

	<header class="not-prose mb-6">
		<h1 id={titleId} class="docs-heading text-3xl font-bold tracking-tight">{data.doc.title}</h1>
		{#if data.doc.tags.length > 0}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each data.doc.tags as tag (tag.id)}
					<span class="badge badge-outline badge-sm">{tag.name}</span>
				{/each}
			</div>
		{/if}
	</header>

	{#if data.contentType === 'markdown'}
		{#if data.html}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="docs-prose">{@html data.html}</div>
		{/if}
	{:else if data.contentType === 'html'}
		{#if data.html}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="docs-prose">{@html data.html}</div>
		{/if}
	{:else if data.contentType === 'csv'}
		{#if data.csv}
			<div class="not-prose overflow-x-auto rounded-box border border-base-200 bg-base-100">
				<table class="table table-sm">
					{#if data.csv.header.length > 0}
						<thead>
							<tr>
								{#each data.csv.header as col, i (i)}
									<th>{col}</th>
								{/each}
							</tr>
						</thead>
					{/if}
					<tbody>
						{#each data.csv.rows as row, r (r)}
							<tr>
								{#each row as cell, c (c)}
									<td class="whitespace-pre-wrap">{cell}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{:else}
		<div class="not-prose">
			<DocMediaViewer
				contentType={data.contentType}
				mediaUrl={data.doc.mediaUrl}
				embedSrc={data.contentType === 'pdf' ? resolve(`/api/document-media/${data.doc.slug}`) : null}
				excerpt={data.doc.excerpt}
				notesHtml={data.html}
			/>
		</div>
	{/if}

	{#if data.hasChildren}
		<section class="not-prose mt-10 border-t border-base-200 pt-8">
			<h2 class="mb-4 text-lg font-semibold">In this section</h2>
			<ul class="menu menu-sm rounded-box border border-base-200 bg-base-200/40">
				{#each data.childPages as child (child.slug)}
					<li>
						<a href={resolve(`/docs/${child.slug}`)}>
							<span class="font-medium">{child.title}</span>
							{#if child.excerpt}
								<span class="text-xs text-base-content/60">{child.excerpt}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<div class="not-prose">
		<DocsPrevNext prev={data.adjacent.prev} next={data.adjacent.next} />
	</div>
</DocsPageShell>

<style>
	:global(.docs-heading),
	:global(.docs-prose h1),
	:global(.docs-prose h2) {
		scroll-margin-top: 5rem;
	}
</style>
