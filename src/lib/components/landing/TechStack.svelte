<script lang="ts">
	let {
		heading,
		items
	}: {
		heading: string;
		items: string[];
	} = $props();
</script>

<section class="border-y border-base-300 bg-base-100 px-4 py-10 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<p class="mb-6 text-center text-sm font-medium tracking-wide text-base-content/50 uppercase">
			{heading}
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			{#each items as item (item)}
				<span class="badge badge-lg badge-outline font-mono">{item}</span>
			{/each}
		</div>
	</div>
</section>
