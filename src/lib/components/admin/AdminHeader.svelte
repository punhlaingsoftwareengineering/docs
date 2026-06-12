<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import SearchTrigger from '$lib/components/layout/SearchTrigger.svelte';
	import { formatPageTitle } from '$lib/utils/page-title';

	let { title, breadcrumbs = [] }: { title: string; breadcrumbs?: { label: string; href?: string }[] } =
		$props();

	const appName = $derived(page.data.site?.appName ?? '');
</script>

<svelte:head>
	<title>{formatPageTitle(title, appName)}</title>
</svelte:head>

<header class="flex items-center justify-between border-b border-base-300 bg-base-100 px-6 py-4">
	<div class="flex min-w-0 flex-1 items-center justify-between gap-4 pr-4">
		<h1 class="shrink-0 text-xl font-bold">{title}</h1>
		{#if breadcrumbs.length > 0}
			<nav aria-label="Breadcrumb" class="breadcrumbs min-w-0 text-xs italic text-base-content/50">
				<ul>
					{#each breadcrumbs as crumb, i (crumb.label)}
						<li>
							{#if crumb.href && i < breadcrumbs.length - 1}
								<a href={crumb.href} class="text-base-content/50 hover:text-base-content/70">
									{crumb.label}
								</a>
							{:else}
								<span class="text-base-content/50">{crumb.label}</span>
							{/if}
						</li>
					{/each}
				</ul>
			</nav>
		{/if}
	</div>
	<div class="flex shrink-0 items-center gap-1">
		<SearchTrigger compact />
		<ThemeToggle />
	</div>
</header>
