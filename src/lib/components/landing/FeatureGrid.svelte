<script lang="ts">
	import { resolve } from '$app/paths';

	const features = [
		{
			title: 'Guides',
			description: 'Step-by-step walkthroughs for common workflows and integrations.',
			badge: 'Learn',
			href: resolve('/docs')
		},
		{
			title: 'API Reference',
			description: 'Endpoints, parameters, and response shapes documented in one place.',
			badge: 'Reference',
			href: resolve('/docs')
		},
		{
			title: 'Examples',
			description: 'Copy-paste snippets and real-world patterns you can adapt quickly.',
			badge: 'Code',
			href: resolve('/docs')
		},
		{
			title: 'Quickstart',
			description: 'Get from zero to a working setup in minutes with a focused checklist.',
			badge: 'Start',
			href: resolve('/docs')
		},
		{
			title: 'Changelog',
			description: 'Track releases, breaking changes, and migration notes over time.',
			badge: 'Updates',
			href: resolve('/docs')
		},
		{
			title: 'Admin tools',
			description: 'Edit markdown in-browser or sync files from the content directory.',
			badge: 'Admin',
			href: resolve('/admin')
		}
	] as const;
</script>

<section class="bg-base-100 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12 max-w-2xl">
			<h2 class="text-3xl font-bold tracking-tight">Everything you need to ship</h2>
			<p class="mt-4 text-base-content/70">
				Organized sections for learning, building, and maintaining software — from first install to
				production.
			</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each features as feature (feature.title)}
				<a href={feature.href} class="card card-border bg-base-200 transition-shadow hover:shadow-md">
					<div class="card-body">
						<div class="card-title items-start justify-between gap-2">
							<span>{feature.title}</span>
							<span class="badge badge-ghost badge-sm">{feature.badge}</span>
						</div>
						<p class="text-sm text-base-content/70">{feature.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
