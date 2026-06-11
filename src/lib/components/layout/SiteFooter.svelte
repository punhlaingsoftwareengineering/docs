<script lang="ts">
	import { resolve } from '$app/paths';

	let {
		siteTitle = 'zarnihlawn docs',
		showAdminLink = false
	}: {
		siteTitle?: string;
		showAdminLink?: boolean;
	} = $props();

	const links = $derived([
		{ label: 'Documentation', href: resolve('/docs') },
		{ label: 'Getting started', href: resolve('/docs') },
		{ label: 'Guides', href: resolve('/docs') },
		{ label: 'API reference', href: resolve('/docs') },
		...(showAdminLink ? [{ label: 'Admin', href: resolve('/admin') }] : [])
	]);
</script>

<footer class="border-t border-base-300 bg-base-200">
	<div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 lg:px-8">
		<div class="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
			<div>
				<p class="text-lg font-semibold">{siteTitle}</p>
				<p class="mt-2 max-w-sm text-sm text-base-content/70">
					Personal software documentation — guides, reference, and examples for building with my
					projects.
				</p>
			</div>

			<nav aria-label="Footer">
				<ul class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
					{#each links as link (link.label)}
						<li>
							<a href={link.href} class="link link-hover text-base-content/80">{link.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>

		<div class="text-sm text-base-content/60">
			<p>&copy; {new Date().getFullYear()} zarnihlawn. Built with SvelteKit.</p>
		</div>
	</div>
</footer>
