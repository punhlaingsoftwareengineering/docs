<script lang="ts">
	let {
		heading,
		subtitle,
		terminalLabel,
		lines
	}: {
		heading: string;
		subtitle: string;
		terminalLabel: string;
		lines: string[];
	} = $props();

	function linePrompt(line: string) {
		return line.startsWith('$ ') ? '$' : null;
	}

	function lineText(line: string) {
		return line.startsWith('$ ') ? line.slice(2) : line;
	}
</script>

<section class="bg-base-200 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="mb-10 max-w-2xl">
			<h2 class="text-3xl font-bold tracking-tight">{heading}</h2>
			<p class="mt-4 text-base-content/70">{subtitle}</p>
		</div>

		<div class="mockup-code w-full border border-base-300 bg-neutral text-neutral-content shadow-xl">
			<div class="flex items-center gap-2 border-b border-neutral-content/10 px-4 py-3">
				<span class="h-3 w-3 rounded-full bg-error/80"></span>
				<span class="h-3 w-3 rounded-full bg-warning/80"></span>
				<span class="h-3 w-3 rounded-full bg-success/80"></span>
				<span class="ml-2 text-xs text-neutral-content/60">{terminalLabel}</span>
			</div>
			{#each lines as line, index (index)}
				{#if linePrompt(line)}
					<pre data-prefix={linePrompt(line)} class="text-sm"><code>{lineText(line)}</code></pre>
				{:else if line}
					<pre class="text-sm opacity-90"><code>{line}</code></pre>
				{:else}
					<pre class="text-sm"><code> </code></pre>
				{/if}
			{/each}
		</div>
	</div>
</section>
