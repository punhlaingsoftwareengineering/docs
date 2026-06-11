<script lang="ts">
	const lines = [
		{ prompt: '$', text: 'cat content/docs/getting-started.md' },
		{ prompt: null, text: '' },
		{ prompt: null, text: '# Getting started' },
		{ prompt: null, text: '' },
		{ prompt: null, text: 'Welcome to the documentation. This site renders markdown' },
		{ prompt: null, text: 'from `content/docs/` or the in-browser admin editor.' },
		{ prompt: null, text: '' },
		{ prompt: null, text: '## Install' },
		{ prompt: null, text: '' },
		{ prompt: null, text: '```bash' },
		{ prompt: null, text: 'pnpm install' },
		{ prompt: null, text: 'pnpm dev' },
		{ prompt: null, text: '```' }
	] as const;
</script>

<section class="bg-base-200 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="mb-10 max-w-2xl">
			<h2 class="text-3xl font-bold tracking-tight">Markdown-first content</h2>
			<p class="mt-4 text-base-content/70">
				Write docs in plain markdown. The same source powers public pages and admin workflows.
			</p>
		</div>

		<div class="mockup-code w-full border border-base-300 bg-neutral text-neutral-content shadow-xl">
			<div class="flex items-center gap-2 border-b border-neutral-content/10 px-4 py-3">
				<span class="h-3 w-3 rounded-full bg-error/80"></span>
				<span class="h-3 w-3 rounded-full bg-warning/80"></span>
				<span class="h-3 w-3 rounded-full bg-success/80"></span>
				<span class="ml-2 text-xs text-neutral-content/60">terminal — docs</span>
			</div>
			{#each lines as line, index (index)}
				{#if line.prompt}
					<pre data-prefix={line.prompt} class="text-sm"><code>{line.text}</code></pre>
				{:else if line.text}
					<pre class="text-sm opacity-90"><code>{line.text}</code></pre>
				{:else}
					<pre class="text-sm"><code> </code></pre>
				{/if}
			{/each}
		</div>
	</div>
</section>
