<script lang="ts">
	import { resolve } from '$app/paths';
	import { openDocsSearch } from '$lib/state/docs-search.svelte';

	let {
		heroTitle,
		heroSubtitle,
		heroPrimaryCta,
		heroPrimaryUrl,
		heroSecondaryCta,
		heroSecondaryUrl,
		tagline,
		showSecondaryCta = true
	}: {
		heroTitle: string;
		heroSubtitle: string;
		heroPrimaryCta: string;
		heroPrimaryUrl: string;
		heroSecondaryCta: string;
		heroSecondaryUrl: string;
		tagline: string;
		showSecondaryCta?: boolean;
	} = $props();
</script>

<section class="hero relative min-h-[75vh] overflow-hidden bg-base-100">
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--color-primary)_18%,transparent),transparent)]"
		aria-hidden="true"
	></div>
	<div
		class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--color-base-content)_6%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--color-base-content)_6%,transparent)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
		aria-hidden="true"
	></div>

	<div class="hero-content relative z-10 w-full max-w-5xl flex-col px-4 py-16 text-center lg:py-28">
		<div class="badge badge-primary badge-outline mb-4">{tagline}</div>

		<h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
			{heroTitle}
		</h1>

		<p class="mt-6 max-w-2xl text-lg text-base-content/70">
			{heroSubtitle}
		</p>

		<div class="mt-10 w-full max-w-xl">
			<button
				type="button"
				class="input input-bordered flex w-full items-center gap-3 text-left transition-colors hover:border-primary focus-within:border-primary"
				aria-label="Search documentation"
				onclick={() => openDocsSearch()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 shrink-0 text-base-content/50"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
				<span class="text-base-content/50">Search documentation…</span>
				<kbd class="kbd kbd-sm ml-auto hidden sm:inline-flex">⌘K</kbd>
			</button>
		</div>

		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a href={heroPrimaryUrl} class="btn btn-primary">
				{heroPrimaryCta}
			</a>
			{#if showSecondaryCta}
				<a href={heroSecondaryUrl} class="btn btn-outline">
					{heroSecondaryCta}
				</a>
			{/if}
		</div>
	</div>
</section>
