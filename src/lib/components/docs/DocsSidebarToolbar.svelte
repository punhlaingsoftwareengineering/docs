<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { openDocsSearch } from '$lib/state/docs-search.svelte';
	import { type Theme, getStoredTheme, toggleTheme } from '$lib/utils/theme';

	let theme = $state<Theme>('winter');

	onMount(() => {
		theme = getStoredTheme();
	});

	function handleThemeToggle() {
		theme = toggleTheme(theme);
	}
</script>

<div class="flex h-14 shrink-0 items-center justify-between border-b border-base-300 px-4">
	<a
		href={resolve('/')}
		class="flex h-9 w-9 items-center justify-center rounded-lg text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
		aria-label="Back to home"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="m12 19-7-7 7-7" />
			<path d="M19 12H5" />
		</svg>
	</a>

	<div class="flex items-center gap-1">
		<button
			type="button"
			class="flex h-9 w-9 items-center justify-center rounded-lg text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
			aria-label="Search documentation"
			onclick={() => openDocsSearch()}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
		</button>

		<button
			type="button"
			class="flex h-9 w-9 items-center justify-center rounded-lg text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
			aria-label={theme === 'winter' ? 'Switch to dark theme' : 'Switch to light theme'}
			onclick={handleThemeToggle}
		>
			{#if theme === 'winter'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2" />
					<path d="M12 20v2" />
					<path d="m4.93 4.93 1.41 1.41" />
					<path d="m17.66 17.66 1.41 1.41" />
					<path d="M2 12h2" />
					<path d="M20 12h2" />
					<path d="m6.34 17.66-1.41 1.41" />
					<path d="m19.07 4.93-1.41 1.41" />
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
				</svg>
			{/if}
		</button>
	</div>
</div>
