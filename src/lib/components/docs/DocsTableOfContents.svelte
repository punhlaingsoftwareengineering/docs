<script lang="ts">
	import type { DocHeading } from '$lib/markdown';

	let { headings }: { headings: DocHeading[] } = $props();

	function scrollToHeading(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

{#if headings.length > 0}
	<nav aria-label="On this page" class="sticky top-24">
		<p class="mb-2 text-xs font-semibold tracking-wide text-base-content/50 uppercase">On this page</p>
		<ul class="space-y-1 border-l border-base-300">
			{#each headings as heading (heading.id)}
				<li>
					<button
						type="button"
						class="block w-full py-1 text-left text-sm text-base-content/70 transition-colors hover:text-primary"
						class:pl-3={heading.level <= 2}
						class:pl-5={heading.level === 3}
						class:pl-7={heading.level >= 4}
						onclick={() => scrollToHeading(heading.id)}
					>
						{heading.text}
					</button>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
