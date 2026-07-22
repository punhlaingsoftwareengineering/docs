<script lang="ts">
	import { onMount } from 'svelte';
	import { syncSharedAppearance, watchSharedAppearance } from '$lib/client/shared-appearance';

	onMount(() => {
		syncSharedAppearance();
		return watchSharedAppearance();
	});
</script>
