<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { type Theme, getStoredTheme, toggleTheme } from '$lib/utils/theme';

	let theme = $state<Theme>('winter');

	onMount(() => {
		theme = getStoredTheme();
	});

	function handleToggle() {
		theme = toggleTheme(theme);
	}
</script>

<button
	type="button"
	class="btn btn-ghost btn-circle swap swap-rotate"
	class:swap-active={theme === 'night'}
	aria-label={theme === 'winter' ? 'Switch to dark theme' : 'Switch to light theme'}
	onclick={handleToggle}
>
	<Sun class="swap-off h-5 w-5" aria-hidden="true" />
	<Moon class="swap-on h-5 w-5" aria-hidden="true" />
</button>
