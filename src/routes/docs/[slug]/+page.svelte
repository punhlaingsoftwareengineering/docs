<script lang="ts">
	import { resolve } from '$app/paths';
	import DocsBreadcrumbs from '$lib/components/docs/DocsBreadcrumbs.svelte';
	import DocsPageShell from '$lib/components/docs/DocsPageShell.svelte';
	import DocsPrevNext from '$lib/components/docs/DocsPrevNext.svelte';
	import DocsTableOfContents from '$lib/components/docs/DocsTableOfContents.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.doc.title} — Documentation</title>
</svelte:head>

<DocsPageShell sidebarGroups={data.sidebarGroups} currentSlug={data.doc.slug}>
	{#if data.headings.length > 0}
		{#snippet toc()}
			<DocsTableOfContents headings={data.headings} />
		{/snippet}
	{/if}

	{#if data.isPreview}
		<div class="alert alert-warning mb-6">
			<span>Draft preview — this page is not visible to visitors.</span>
		</div>
	{/if}

	<DocsBreadcrumbs
		categoryName={data.doc.categoryName}
		ancestors={data.ancestors}
		currentTitle={data.doc.title}
	/>

	<header class="mb-8 border-b border-base-300 pb-6">
		<h1 class="mt-4 text-3xl font-bold">{data.doc.title}</h1>
		{#if data.doc.tags.length > 0}
			<div class="mt-3 flex flex-wrap gap-2">
				{#each data.doc.tags as tag (tag.id)}
					<span class="badge badge-outline badge-sm">{tag.name}</span>
				{/each}
			</div>
		{/if}
	</header>

	{#if data.html}
		<div class="prose max-w-none">{@html data.html}</div>
	{/if}

	{#if data.hasChildren}
		<section class="mt-10 border-t border-base-300 pt-8">
			<h2 class="mb-4 text-lg font-semibold">In this section</h2>
			<ul class="menu menu-sm rounded-box border border-base-300 bg-base-100">
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

	<DocsPrevNext prev={data.adjacent.prev} next={data.adjacent.next} />
</DocsPageShell>
