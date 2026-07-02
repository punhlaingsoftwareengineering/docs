<script lang="ts">
	import { ExternalLink, FileSpreadsheet, FileText, Presentation } from '@lucide/svelte';
	import {
		DEFAULT_DOCUMENT_CONTENT_TYPE,
		type DocumentContentType
	} from '$lib/constants/document-content';
	import {
		canUseOfficeOnlineEmbed,
		fileNameFromUrl,
		getOfficeFileKind,
		isDirectVideoFile,
		officeEmbedUrl,
		vimeoEmbedUrl,
		youtubeEmbedUrl
	} from '$lib/utils/media-url';

	let {
		contentType = DEFAULT_DOCUMENT_CONTENT_TYPE,
		mediaUrl = '',
		embedSrc = '',
		excerpt = '',
		notesHtml = ''
	}: {
		contentType?: DocumentContentType | string;
		mediaUrl?: string | null;
		embedSrc?: string | null;
		excerpt?: string | null;
		notesHtml?: string;
	} = $props();

	const url = $derived(mediaUrl?.trim() ?? '');
	const hasNotes = $derived(Boolean(notesHtml?.trim()));
	const youtubeEmbed = $derived(url ? youtubeEmbedUrl(url) : null);
	const vimeoEmbed = $derived(url ? vimeoEmbedUrl(url) : null);
	const officeEmbedAvailable = $derived(url ? canUseOfficeOnlineEmbed(url) : false);
	const officeFileKind = $derived(url ? getOfficeFileKind(url) : 'Office document');
	const officeFileName = $derived(url ? fileNameFromUrl(url) : 'Download file');
	const pdfViewSrc = $derived(embedSrc?.trim() || url);

	function officeIconKind(fileKind: string) {
		if (fileKind.includes('PowerPoint')) return 'presentation';
		if (fileKind.includes('Excel')) return 'spreadsheet';
		return 'document';
	}
</script>

{#if contentType === 'markdown'}
	{#if hasNotes}
		<div class="prose docs-prose max-w-none">{@html notesHtml}</div>
	{/if}
{:else if !url}
	<div class="alert alert-warning">
		<span>No media URL configured for this page.</span>
	</div>
{:else}
	<div class="card border border-base-300 bg-base-100">
		{#if contentType === 'pdf'}
			<div class="flex items-center justify-end border-b border-base-300 px-4 py-3">
				<a href={url} target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm gap-2">
					<ExternalLink class="h-4 w-4" aria-hidden="true" />
					Open PDF in new tab
				</a>
			</div>
			<iframe
				title="PDF document"
				src={pdfViewSrc}
				class="min-h-[80vh] w-full rounded-b-box border-0 bg-base-200"
			></iframe>
		{:else if contentType === 'video'}
			<div class="flex items-center justify-end border-b border-base-300 px-4 py-3">
				<a href={url} target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm gap-2">
					<ExternalLink class="h-4 w-4" aria-hidden="true" />
					Open video in new tab
				</a>
			</div>
			<div class="card-body p-0 sm:p-0">
				{#if youtubeEmbed}
					<div class="aspect-video w-full overflow-hidden">
						<iframe
							title="Video player"
							src={youtubeEmbed}
							class="h-full w-full border-0"
							loading="lazy"
							referrerpolicy="no-referrer"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				{:else if vimeoEmbed}
					<div class="aspect-video w-full overflow-hidden">
						<iframe
							title="Video player"
							src={vimeoEmbed}
							class="h-full w-full border-0"
							loading="lazy"
							referrerpolicy="no-referrer"
							allow="autoplay; fullscreen; picture-in-picture"
							allowfullscreen
						></iframe>
					</div>
				{:else if isDirectVideoFile(url)}
					<!-- svelte-ignore a11y_media_has_caption -->
					<video controls class="w-full" preload="metadata">
						<source src={url} />
						<track kind="captions" />
					</video>
				{:else}
					<div class="aspect-video w-full overflow-hidden">
						<iframe
							title="Video player"
							src={url}
							class="h-full w-full border-0"
							loading="lazy"
							referrerpolicy="no-referrer"
							allowfullscreen
						></iframe>
					</div>
				{/if}
			</div>
		{:else if contentType === 'audio'}
			<div class="flex items-center justify-end border-b border-base-300 px-4 py-3">
				<a href={url} target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm gap-2">
					<ExternalLink class="h-4 w-4" aria-hidden="true" />
					Open audio in new tab
				</a>
			</div>
			<div class="p-6">
				<audio controls class="w-full" preload="metadata">
					<source src={url} />
					<track kind="captions" />
				</audio>
			</div>
		{:else if contentType === 'image'}
			<div class="flex items-center justify-end border-b border-base-300 px-4 py-3">
				<a href={url} target="_blank" rel="noopener noreferrer" class="btn btn-ghost btn-sm gap-2">
					<ExternalLink class="h-4 w-4" aria-hidden="true" />
					Open image in new tab
				</a>
			</div>
			<figure class="p-4">
				<img
					src={url}
					alt={excerpt?.trim() || 'Document image'}
					class="mx-auto max-h-[80vh] w-full rounded-box object-contain"
					loading="lazy"
				/>
				{#if excerpt?.trim()}
					<figcaption class="mt-3 text-center text-sm text-base-content/70">{excerpt}</figcaption>
				{/if}
			</figure>
		{:else if contentType === 'office'}
			{#if officeEmbedAvailable}
				<div class="flex items-center justify-end border-b border-base-300 px-4 py-3">
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-ghost btn-sm gap-2"
					>
						<ExternalLink class="h-4 w-4" aria-hidden="true" />
						Open file in new tab
					</a>
				</div>
				<iframe
					title="Office document"
					src={officeEmbedUrl(url)}
					class="min-h-[80vh] w-full rounded-b-box border-0"
					loading="lazy"
					referrerpolicy="no-referrer"
					sandbox="allow-scripts allow-same-origin"
				></iframe>
			{:else}
				<div class="flex items-center justify-end border-b border-base-300 px-4 py-3">
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						class="btn btn-primary btn-sm gap-2"
					>
						<ExternalLink class="h-4 w-4" aria-hidden="true" />
						Open / download file
					</a>
				</div>
				<div class="flex flex-col items-center gap-4 p-8 text-center sm:p-12">
					<div class="rounded-box bg-base-200 p-4">
						{#if officeIconKind(officeFileKind) === 'presentation'}
							<Presentation class="h-12 w-12 text-primary" aria-hidden="true" />
						{:else if officeIconKind(officeFileKind) === 'spreadsheet'}
							<FileSpreadsheet class="h-12 w-12 text-primary" aria-hidden="true" />
						{:else}
							<FileText class="h-12 w-12 text-primary" aria-hidden="true" />
						{/if}
					</div>
					<div class="max-w-lg space-y-2">
						<h3 class="text-lg font-semibold">{officeFileName}</h3>
						<p class="text-sm text-base-content/70">{officeFileKind}</p>
						<p class="text-sm text-base-content/60">
							In-browser Office preview needs a public <code class="text-xs">https://</code> link
							Microsoft can reach. LAN and <code class="text-xs">http://</code> files cannot be embedded
							— open or download the file instead, or export as PDF and use the PDF content type for in-page
							viewing.
						</p>
					</div>
				</div>
			{/if}
		{/if}
	</div>

	{#if hasNotes}
		<div class="prose docs-prose mt-8 max-w-none">{@html notesHtml}</div>
	{/if}
{/if}
