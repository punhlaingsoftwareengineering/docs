<script lang="ts">
	import QRCode from 'qrcode';

	let { uri }: { uri: string } = $props();
</script>

{#if uri}
	{#await QRCode.toDataURL(uri, { width: 220, margin: 1 })}
		<span class="loading loading-spinner loading-md mx-auto block" aria-label="Generating QR code"
		></span>
	{:then dataUrl}
		<img
			src={dataUrl}
			alt="Authenticator QR code"
			class="mx-auto rounded-box border border-base-300"
		/>
	{/await}
{/if}
