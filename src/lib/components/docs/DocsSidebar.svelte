<script lang="ts">
	import { resolve } from '$app/paths';

	type DocItem = { slug: string; title: string };
	type CategoryGroup = { name: string; slug: string; docs: DocItem[] };

	let { groups, currentSlug }: { groups: CategoryGroup[]; currentSlug?: string } = $props();
</script>

<nav class="space-y-6">
	{#each groups as group (group.slug)}
		<div>
			<h3 class="mb-2 text-xs font-semibold tracking-wide text-base-content/50 uppercase">
				{group.name}
			</h3>
			<ul class="space-y-1">
				{#each group.docs as doc (doc.slug)}
					<li>
						<a
							href={resolve(`/docs/${doc.slug}`)}
							class="block rounded-lg px-3 py-1.5 text-sm transition-colors"
							class:bg-primary={currentSlug === doc.slug}
							class:text-primary-content={currentSlug === doc.slug}
							class:hover:bg-base-200={currentSlug !== doc.slug}
						>
							{doc.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
