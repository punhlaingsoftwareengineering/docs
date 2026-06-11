<script lang="ts">
	import { resolve } from '$app/paths';

	let { showAdminLink = false }: { showAdminLink?: boolean } = $props();
</script>

<section class="bg-base-200 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-4xl text-center">
		<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Ready to dive in?</h2>
		<p class="mx-auto mt-4 max-w-xl text-base-content/70">
			Start with the getting started guide or jump straight into the reference. Everything is written
			in markdown and built for developers.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a href={resolve('/docs')} class="btn btn-primary btn-lg">Read the docs</a>
			{#if showAdminLink}
				<a href={resolve('/admin')} class="btn btn-ghost btn-lg">Admin area</a>
			{/if}
		</div>
	</div>
</section>
