<script lang="ts">
	import { resolve } from '$app/paths';

	const categories = [
		{
			title: 'Getting Started',
			description: 'Install, configure, and publish your first doc page.',
			count: '4 articles'
		},
		{
			title: 'Guides',
			description: 'Deep dives into workflows, auth, deployment, and content management.',
			count: '12 articles'
		},
		{
			title: 'Reference',
			description: 'API endpoints, schemas, environment variables, and CLI commands.',
			count: '8 articles'
		},
		{
			title: 'Examples',
			description: 'Recipes and sample projects to copy and adapt.',
			count: '6 articles'
		},
		{
			title: 'Changelog',
			description: 'Version history, deprecations, and upgrade paths.',
			count: 'Updated regularly'
		},
		{
			title: 'Admin',
			description: 'Editor, file sync, and site settings for the documentation owner.',
			count: 'Admin only'
		}
	] as const;
</script>

<section class="bg-base-100 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div class="max-w-2xl">
				<h2 class="text-3xl font-bold tracking-tight">Browse by category</h2>
				<p class="mt-4 text-base-content/70">
					Jump into the section that matches what you are trying to do right now.
				</p>
			</div>
			<a href={resolve('/docs')} class="btn btn-outline btn-sm w-fit">View all docs</a>
		</div>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each categories as category (category.title)}
				<a
					href={resolve('/docs')}
					class="card card-border bg-base-200 transition-colors hover:border-primary/40 hover:bg-base-100"
				>
					<div class="card-body">
						<h3 class="card-title text-lg">{category.title}</h3>
						<p class="text-sm text-base-content/70">{category.description}</p>
						<div class="card-actions justify-start">
							<span class="badge badge-outline badge-sm">{category.count}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
