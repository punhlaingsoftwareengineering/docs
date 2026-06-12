<script lang="ts">
	import { formatPageTitle } from '$lib/utils/page-title';

	let { title, appName }: { title: string; appName: string } = $props();
</script>

<svelte:head>
	<title>{formatPageTitle(title, appName)}</title>
</svelte:head>
