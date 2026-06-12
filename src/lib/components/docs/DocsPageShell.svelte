<script lang="ts">
	import type { Snippet } from 'svelte';
	import DocsChapterSidebar from '$lib/components/docs/DocsChapterSidebar.svelte';
	import DocsSidebarToolbar from '$lib/components/docs/DocsSidebarToolbar.svelte';
	import type { SidebarGroup } from '$lib/types/docs-tree';

	let {
		sidebarGroups,
		currentSlug,
		children,
		toc
	}: {
		sidebarGroups: SidebarGroup[];
		currentSlug?: string;
		children: Snippet;
		toc?: Snippet;
	} = $props();

	let drawerOpen = $state(false);
</script>

{#snippet sidebarNav()}
	<div class="flex-1 overflow-y-auto px-3 pb-6">
		<DocsChapterSidebar
			groups={sidebarGroups}
			{currentSlug}
			onnavigate={() => (drawerOpen = false)}
		/>
	</div>
{/snippet}

<div class="flex min-h-screen w-full">
	<!-- Desktop sidebar: flush left edge, full height -->
	<aside class="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-base-300 bg-base-100 lg:flex xl:w-72">
		<DocsSidebarToolbar />
		{@render sidebarNav()}
	</aside>

	<div class="flex min-w-0 flex-1 flex-col">
		<!-- Mobile: toolbar + menu toggle -->
		<div class="flex items-stretch border-b border-base-300 lg:hidden">
			<DocsSidebarToolbar />
		</div>
		<label
			for="docs-drawer"
			class="flex h-10 shrink-0 cursor-pointer items-center gap-2 border-b border-base-300 px-4 text-sm text-base-content/70 lg:hidden"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
			Browse docs
		</label>

		<div class="drawer flex-1 lg:contents">
			<input id="docs-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

			<div class="drawer-side z-40 lg:hidden">
				<label for="docs-drawer" aria-label="Close documentation menu" class="drawer-overlay"></label>
				<aside class="flex h-full w-72 flex-col bg-base-100">
					{@render sidebarNav()}
				</aside>
			</div>

			<div class="drawer-content flex min-w-0 flex-1 flex-col lg:min-h-screen">
				<div class="flex min-w-0 flex-1 justify-center">
					<div class="flex w-full max-w-[1600px] gap-10 pl-6 pr-6 sm:pl-10 sm:pr-8 xl:gap-14 xl:pl-14 xl:pr-12">
						<article class="min-w-0 flex-1 pb-8 pt-4 lg:pt-6">
							{@render children()}
						</article>
						{#if toc}
							<aside class="hidden w-44 shrink-0 xl:block">
								<div class="sticky top-6 py-6 lg:py-8">
									{@render toc()}
								</div>
							</aside>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
