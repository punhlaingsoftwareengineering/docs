<script lang="ts">
	import { resolve } from '$app/paths';
	import type { LandingCategorySection } from '$lib/types/landing';

	let {
		heading,
		subtitle,
		sections
	}: {
		heading: string;
		subtitle: string;
		sections: LandingCategorySection[];
	} = $props();

	function seeAllLabel(count: number) {
		if (count === 1) return 'See article';
		return `See all ${count} articles`;
	}
</script>

<section class="bg-base-100 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div class="max-w-2xl">
				<h2 class="text-3xl font-bold tracking-tight">{heading}</h2>
				<p class="mt-4 text-base-content/70">{subtitle}</p>
			</div>
		</div>

		{#if sections.length === 0}
			<div
				class="rounded-box border border-dashed border-base-300 p-8 text-center text-base-content/60"
			>
				No published categories yet. Add categories and documents in Admin.
			</div>
		{:else}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each sections as section (section.id)}
					<article class="card card-border bg-base-200 transition-shadow hover:shadow-md">
						<div class="card-body gap-4">
							<div class="card-title items-start justify-between gap-2">
								<a
									href={resolve(`/docs/category/${section.id}`)}
									class="link link-hover"
								>
									{section.name}
								</a>
								<span class="badge badge-ghost badge-sm">{section.badge}</span>
							</div>

							<p class="text-sm text-base-content/70">{section.description}</p>

							{#if section.documents.length > 0}
								<ul class="menu menu-sm -mx-2 rounded-box bg-base-100/60 p-0">
									{#each section.documents as doc (doc.id)}
										<li>
											<a href={resolve(`/docs/${doc.id}`)} class="flex-col items-start py-2">
												<span class="font-medium">{doc.title}</span>
												{#if doc.excerpt}
													<span class="text-xs text-base-content/60">{doc.excerpt}</span>
												{/if}
											</a>
										</li>
									{/each}
								</ul>
							{/if}

							<div class="card-actions justify-start pt-1">
								<a
									href={resolve(`/docs/category/${section.id}`)}
									class="link link-primary text-sm"
								>
									{seeAllLabel(section.documentCount)} →
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>
