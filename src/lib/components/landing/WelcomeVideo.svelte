<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import {
		isDirectVideoFile,
		vimeoEmbedUrl,
		youtubeEmbedUrl
	} from '$lib/utils/media-url';

	let {
		heading,
		subtitle,
		videoUrl
	}: {
		heading: string;
		subtitle: string;
		videoUrl: string;
	} = $props();

	const url = $derived(videoUrl.trim());
	const youtubeEmbed = $derived(url ? youtubeEmbedUrl(url) : null);
	const vimeoEmbed = $derived(url ? vimeoEmbedUrl(url) : null);
</script>

<section class="bg-base-200 px-4 py-16 lg:px-8 lg:py-24">
	<div class="mx-auto max-w-6xl">
		<div class="mb-10 max-w-2xl">
			<h2 class="text-3xl font-bold tracking-tight">{heading}</h2>
			<p class="mt-4 text-base-content/70">{subtitle}</p>
		</div>

		{#if !url}
			<div
				class="flex aspect-video items-center justify-center rounded-box border border-dashed border-base-300 bg-base-100 text-center text-base-content/60"
			>
				<p class="max-w-md px-6 text-sm">
					Add a welcome video URL in Admin → Settings to show an onboarding video here.
				</p>
			</div>
		{:else}
			<div class="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl">
				<div class="flex items-center justify-end border-b border-base-300 px-4 py-3">
					<a href={url} target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm gap-2">
						<ExternalLink class="h-4 w-4" aria-hidden="true" />
						Open video in new tab
					</a>
				</div>
				<div class="aspect-video w-full bg-neutral">
					{#if youtubeEmbed}
						<iframe
							title="Welcome video"
							src={youtubeEmbed}
							class="h-full w-full border-0"
							loading="lazy"
							referrerpolicy="no-referrer"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					{:else if vimeoEmbed}
						<iframe
							title="Welcome video"
							src={vimeoEmbed}
							class="h-full w-full border-0"
							loading="lazy"
							referrerpolicy="no-referrer"
							allow="autoplay; fullscreen; picture-in-picture"
							allowfullscreen
						></iframe>
					{:else if isDirectVideoFile(url)}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video controls class="h-full w-full" preload="metadata">
							<source src={url} />
							<track kind="captions" />
						</video>
					{:else}
						<iframe
							title="Welcome video"
							src={url}
							class="h-full w-full border-0"
							loading="lazy"
							referrerpolicy="no-referrer"
							allowfullscreen
						></iframe>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>
