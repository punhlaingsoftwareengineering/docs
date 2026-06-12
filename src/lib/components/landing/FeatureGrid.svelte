<script lang="ts">
	import type { LandingFeature } from '$lib/types/landing';

	let {
		heading,
		subtitle,
		items
	}: {
		heading: string;
		subtitle: string;
		items: LandingFeature[];
	} = $props();
</script>

<section class="bg-base-100 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12 max-w-2xl">
			<h2 class="text-3xl font-bold tracking-tight">{heading}</h2>
			<p class="mt-4 text-base-content/70">{subtitle}</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each items as feature (feature.title)}
				<a
					href={feature.href}
					class="card card-border bg-base-200 transition-shadow hover:shadow-md"
				>
					<div class="card-body">
						<div class="card-title items-start justify-between gap-2">
							<span>{feature.title}</span>
							<span class="badge badge-ghost badge-sm">{feature.badge}</span>
						</div>
						<p class="text-sm text-base-content/70">{feature.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
