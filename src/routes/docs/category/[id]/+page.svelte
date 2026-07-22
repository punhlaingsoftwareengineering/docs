<script lang="ts">
	import { resolve } from '$app/paths';
	import DocsPageShell from '$lib/components/docs/DocsPageShell.svelte';
	import DocsSectionList from '$lib/components/docs/DocsSectionList.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

	let { data } = $props();
</script>

<PageTitle title={data.category.name} appName={data.site.appName} />

<DocsPageShell
	appName={data.site.appName}
	sidebarGroups={data.sidebarGroups}
	currentCategoryId={data.category.id}
>
	{#snippet breadcrumbs()}
		<nav aria-label="Breadcrumb" class="breadcrumbs text-sm">
			<ul>
				<li><a href={resolve('/docs')}>Docs</a></li>
				<li><span class="font-medium">{data.category.name}</span></li>
			</ul>
		</nav>
	{/snippet}

	<div class="not-prose mx-auto max-w-4xl">
		<header class="mb-10">
			<h1 class="mb-3 text-3xl font-bold tracking-tight text-base-content">{data.category.name}</h1>
			{#if data.description}
				<p class="text-lg leading-relaxed text-base-content/70">{data.description}</p>
			{/if}
		</header>

		{#if data.items.length === 0}
			<p class="text-base-content/60">No published pages in this section yet.</p>
		{:else}
			<DocsSectionList items={data.items} />
		{/if}
	</div>
</DocsPageShell>
