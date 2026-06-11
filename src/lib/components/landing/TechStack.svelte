<script lang="ts">
	const stack = ['SvelteKit', 'Markdown', 'Drizzle', 'Better Auth', 'Tailwind', 'daisyUI'] as const;
</script>

<section class="border-y border-base-300 bg-base-100 px-4 py-10 lg:px-8">
	<div class="mx-auto max-w-6xl">
		<p class="mb-6 text-center text-sm font-medium tracking-wide text-base-content/50 uppercase">
			Powered by a modern docs stack
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			{#each stack as item (item)}
				<span class="badge badge-lg badge-outline font-mono">{item}</span>
			{/each}
		</div>
	</div>
</section>
