<script lang="ts">
	import { ArrowLeft, Moon, Search, Sun } from '@lucide/svelte';
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
	<a href={resolve('/')} class="btn btn-ghost btn-sm btn-square" aria-label="Back to home">
		<ArrowLeft class="h-5 w-5" aria-hidden="true" />
	</a>

	<div class="flex items-center gap-1">
		<button
			type="button"
			class="btn btn-ghost btn-sm btn-square"
			aria-label="Search documentation"
			onclick={() => openDocsSearch()}
		>
			<Search class="h-5 w-5" aria-hidden="true" />
		</button>

		<button
			type="button"
			class="btn btn-ghost btn-sm btn-square"
			aria-label={theme === 'winter' ? 'Switch to dark theme' : 'Switch to light theme'}
			onclick={handleThemeToggle}
		>
			{#if theme === 'winter'}
				<Sun class="h-5 w-5" aria-hidden="true" />
			{:else}
				<Moon class="h-5 w-5" aria-hidden="true" />
			{/if}
		</button>
	</div>
</div>
