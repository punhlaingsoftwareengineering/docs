<script lang="ts">
	import type { DocHeading } from '$lib/markdown';

	let { headings }: { headings: DocHeading[] } = $props();

	let activeId = $state('');

	function scrollBehavior(): ScrollBehavior {
		if (typeof window === 'undefined') return 'auto';
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
	}

	function scrollToHeading(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
			history.replaceState(null, '', `#${id}`);
			activeId = id;
		}
	}

	function handleLinkClick(e: MouseEvent, id: string) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
		e.preventDefault();
		scrollToHeading(id);
	}

	function linkClass(heading: DocHeading, isActive: boolean) {
		const level = heading.level === 1 ? 'pl-3' : 'pl-5';
		const state = isActive
			? 'border-primary font-medium text-primary'
			: 'border-transparent text-base-content/70';
		return `block border-l-2 py-1 text-left text-sm transition-colors hover:text-primary ${level} ${state}`;
	}

	$effect(() => {
		const ids = headings.map((h) => h.id);
		activeId = ids[0] ?? '';

		const elements = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => el != null);

		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((e) => e.isIntersecting);
				if (visible.length === 0) return;

				const topmost = visible.reduce((best, entry) =>
					entry.boundingClientRect.top < best.boundingClientRect.top ? entry : best
				);
				activeId = topmost.target.id;
			},
			{ rootMargin: '-96px 0px -70% 0px', threshold: 0 }
		);

		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

{#if headings.length > 0}
	<nav aria-label="On this page" class="sticky top-24">
		<p class="mb-2 text-xs font-semibold tracking-wide text-base-content/50 uppercase">
			On this page
		</p>
		<ul class="space-y-0.5 border-l border-base-300">
			{#each headings as heading, i (`${heading.id}-${i}`)}
				<li>
					<a
						href="#{heading.id}"
						class={linkClass(heading, activeId === heading.id)}
						onclick={(e) => handleLinkClick(e, heading.id)}
					>
						{heading.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}
