<script lang="ts">
	import { resolve } from '$app/paths';
	import type { LandingCategoryCard } from '$lib/types/landing';

	let {
		heading,
		subtitle,
		ctaLabel,
		ctaUrl,
		descriptions,
		categories
	}: {
		heading: string;
		subtitle: string;
		ctaLabel: string;
		ctaUrl: string;
		descriptions: Record<string, string>;
		categories: LandingCategoryCard[];
	} = $props();

	function categoryDescription(category: LandingCategoryCard) {
		return (
			descriptions[category.slug] ??
			`Browse ${category.name.toLowerCase()} documentation and guides.`
		);
	}

	function countLabel(count: number) {
		if (count === 0) return 'No articles yet';
		if (count === 1) return '1 article';
		return `${count} articles`;
	}
</script>

<section class="bg-base-100 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div class="max-w-2xl">
				<h2 class="text-3xl font-bold tracking-tight">{heading}</h2>
				<p class="mt-4 text-base-content/70">{subtitle}</p>
			</div>
			<a href={ctaUrl} class="btn btn-outline btn-sm w-fit">{ctaLabel}</a>
		</div>

		{#if categories.length === 0}
			<div class="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/60">
				No categories yet. Add categories and documents in Admin.
			</div>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each categories as category (category.slug)}
					<a
						href={resolve(`/docs/${category.entrySlug}`)}
						class="card card-border bg-base-200 transition-colors hover:border-primary/40 hover:bg-base-100"
					>
						<div class="card-body">
							<h3 class="card-title text-lg">{category.name}</h3>
							<p class="text-sm text-base-content/70">{categoryDescription(category)}</p>
							<div class="card-actions justify-start">
								<span class="badge badge-outline badge-sm">{countLabel(category.documentCount)}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
