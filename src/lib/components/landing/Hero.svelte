<script lang="ts">
	let {
		heroTitle,
		heroSubtitle,
		heroPrimaryCta,
		heroPrimaryUrl,
		tagline
	}: {
		heroTitle: string;
		heroSubtitle: string;
		heroPrimaryCta: string;
		heroPrimaryUrl: string;
		tagline: string;
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

		<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
			<a href={heroPrimaryUrl} class="btn btn-primary">
				{heroPrimaryCta}
			</a>
		</div>
	</div>
</section>
