<script lang="ts">
	import DriveMediaPickerDialog from '$lib/components/admin/DriveMediaPickerDialog.svelte';
	import { HardDriveUpload } from '@lucide/svelte';

	let {
		value = $bindable(''),
		accept = '*/*',
		placeholder = 'http://…',
		disabled = false,
		onchange,
		onUrlApplied
	}: {
		value?: string;
		accept?: string;
		placeholder?: string;
		disabled?: boolean;
		onchange?: () => void;
		onUrlApplied?: (url: string) => void;
	} = $props();

	let picker = $state<DriveMediaPickerDialog | null>(null);

	const isImage = $derived(accept.includes('image'));

	function applyUrl(url: string) {
		value = url;
		onUrlApplied?.(url);
		onchange?.();
	}
</script>

<div class="flex w-full flex-col gap-2">
	<div class="flex gap-2">
		<input
			id="mediaUrl"
			type="text"
			inputmode="url"
			autocomplete="url"
			class="input input-bordered min-w-0 flex-1"
			bind:value
			{placeholder}
			{disabled}
			onblur={() => onchange?.()}
		/>
		<button
			type="button"
			class="btn btn-secondary shrink-0"
			{disabled}
			onclick={() => picker?.open()}
		>
			<HardDriveUpload class="size-4" />
			Upload to Drive
		</button>
	</div>
	{#if value && isImage}
		<img src={value} alt="" class="h-16 w-16 rounded-box border border-base-300 object-cover" />
	{/if}
</div>

<DriveMediaPickerDialog bind:this={picker} {accept} onSelect={applyUrl} />
