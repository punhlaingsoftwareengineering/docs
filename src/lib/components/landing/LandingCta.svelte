<script lang="ts">
	let {
		heading,
		subtitle,
		primaryLabel,
		primaryUrl,
		secondaryLabel,
		secondaryUrl,
		showSecondaryCta = false
	}: {
		heading: string;
		subtitle: string;
		primaryLabel: string;
		primaryUrl: string;
		secondaryLabel: string;
		secondaryUrl: string;
		showSecondaryCta?: boolean;
	} = $props();
</script>

<section class="bg-base-200 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-4xl text-center">
		<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{heading}</h2>
		<p class="mx-auto mt-4 max-w-xl text-base-content/70">{subtitle}</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a href={primaryUrl} class="btn btn-primary btn-lg">{primaryLabel}</a>
			{#if showSecondaryCta}
				<a href={secondaryUrl} class="btn btn-ghost btn-lg">{secondaryLabel}</a>
			{/if}
		</div>
	</div>
</section>
