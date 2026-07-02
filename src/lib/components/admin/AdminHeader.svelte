<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { page } from '$app/state';
	import { getAdminNavContext } from '$lib/admin/nav-context';
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import SearchTrigger from '$lib/components/layout/SearchTrigger.svelte';
	import { formatPageTitle } from '$lib/utils/page-title';

	let {
		title,
		breadcrumbs = []
	}: { title: string; breadcrumbs?: { label: string; href?: string }[] } = $props();

	const appName = $derived(page.data.site?.appName ?? '');
	const adminNav = getAdminNavContext();
</script>

<svelte:head>
	<title>{formatPageTitle(title, appName)}</title>
</svelte:head>

<header
	class="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-base-300 bg-base-100 px-4 py-3 sm:px-6 sm:py-4"
>
	<div class="flex min-w-0 flex-1 items-start gap-2">
		{#if adminNav}
			<button
				type="button"
				class="btn btn-ghost btn-square btn-sm mt-0.5 shrink-0 lg:hidden"
				aria-label="Open menu"
				onclick={() => adminNav.open()}
			>
				<Menu class="h-5 w-5" aria-hidden="true" />
			</button>
		{/if}
		<div class="min-w-0 flex-1">
			<h1 class="truncate text-lg font-bold sm:text-xl">{title}</h1>
			{#if breadcrumbs.length > 0}
				<nav
					aria-label="Breadcrumb"
					class="breadcrumbs mt-1 min-w-0 overflow-x-auto text-xs text-base-content/50"
				>
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
	</div>
	<div class="flex shrink-0 items-center gap-1">
		<SearchTrigger compact />
		<ThemeToggle />
	</div>
</header>
