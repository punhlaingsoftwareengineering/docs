<script lang="ts">
	import { resolve } from '$app/paths';
	import DocsPageShell from '$lib/components/docs/DocsPageShell.svelte';
	import DocsSectionList from '$lib/components/docs/DocsSectionList.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	let { data } = $props();
</script>

<PageTitle title={data.category.name} appName={data.site.appName} />

<DocsPageShell sidebarGroups={data.sidebarGroups} currentCategorySlug={data.category.slug}>
	<nav aria-label="Breadcrumb" class="breadcrumbs text-sm text-base-content/70">
		<ul>
			<li><a href={resolve('/docs')}>Docs</a></li>
			<li class="text-base-content">{data.category.name}</li>
		</ul>
	</nav>

	<header class="mb-8 border-b border-base-300 pb-6">
		<h1 class="mt-4 text-3xl font-bold">{data.category.name}</h1>
		{#if data.description}
			<p class="mt-3 max-w-2xl text-base-content/70">{data.description}</p>
		{/if}
	</header>

	{#if data.items.length === 0}
		<p class="text-base-content/60">No published pages in this section yet.</p>
	{:else}
		<DocsSectionList items={data.items} />
	{/if}
</DocsPageShell>
