<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		class: className = ''
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<table
	class="admin-form-table table w-full table-fixed border-separate [border-spacing:0.75rem] {className}"
>
	<colgroup>
		<col class="w-[11rem]" />
		<col />
		<col class="w-[11rem]" />
		<col />
	</colgroup>
	<tbody>
		{@render children()}
	</tbody>
</table>
