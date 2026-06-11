<script lang="ts">
	import ThemeToggle from '$lib/components/layout/ThemeToggle.svelte';
	import SearchTrigger from '$lib/components/layout/SearchTrigger.svelte';

	let { title, breadcrumbs = [] }: { title: string; breadcrumbs?: { label: string; href?: string }[] } =
		$props();
</script>

<header class="flex items-center justify-between border-b border-base-300 bg-base-100 px-6 py-4">
	<div>
		{#if breadcrumbs.length > 0}
			<div class="breadcrumbs text-sm">
				<ul>
					{#each breadcrumbs as crumb, i (crumb.label)}
						<li>
							{#if crumb.href && i < breadcrumbs.length - 1}
								<a href={crumb.href}>{crumb.label}</a>
							{:else}
								{crumb.label}
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		<h1 class="text-xl font-bold">{title}</h1>
	</div>
	<div class="flex items-center gap-1">
		<SearchTrigger compact />
		<ThemeToggle />
	</div>
</header>
