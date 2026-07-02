<script lang="ts">
	import MarkdownEditor from '$lib/components/admin/MarkdownEditor.svelte';
	import DocMediaViewer from '$lib/components/docs/DocMediaViewer.svelte';
	import {
		DEFAULT_DOCUMENT_CONTENT_TYPE,
		DOCUMENT_CONTENT_TYPE_LABELS,
		DOCUMENT_CONTENT_TYPES,
		isMediaContentType,
		type DocumentContentType
	} from '$lib/constants/document-content';
	import { renderMarkdown, sanitizeDocHtml } from '$lib/markdown';
	import { suggestContentTypeFromUrl, canUseOfficeOnlineEmbed } from '$lib/utils/media-url';

	let {
		content = $bindable(''),
		contentType = $bindable<DocumentContentType>(DEFAULT_DOCUMENT_CONTENT_TYPE),
		mediaUrl = $bindable(''),
		pdfEmbedSrc = '',
		excerpt = '',
		disabled = false,
		mediaUrlError
	}: {
		content?: string;
		contentType?: DocumentContentType;
		mediaUrl?: string;
		pdfEmbedSrc?: string;
		excerpt?: string;
		disabled?: boolean;
		mediaUrlError?: string;
	} = $props();

	const isInlineContent = $derived(
		contentType === 'markdown' || contentType === 'html' || contentType === 'csv'
	);
	const notesHtml = $derived(
		contentType === 'html' ? sanitizeDocHtml(content) : renderMarkdown(content)
	);
	const officeEmbedUnavailable = $derived(
		contentType === 'office' && mediaUrl.trim() && !canUseOfficeOnlineEmbed(mediaUrl.trim())
	);

	function handleMediaUrlBlur() {
		if (!mediaUrl.trim()) return;
		const suggested = suggestContentTypeFromUrl(mediaUrl);
		if (suggested) contentType = suggested;
	}
</script>

<div class="space-y-4">
	<div class="max-w-md">
		<label class="label py-0" for="contentType">
			<span class="label-text font-medium">Content type</span>
		</label>
		<select
			id="contentType"
			name="contentType"
			class="select select-bordered w-full"
			bind:value={contentType}
			{disabled}
		>
			{#each DOCUMENT_CONTENT_TYPES as type (type)}
				<option value={type}>{DOCUMENT_CONTENT_TYPE_LABELS[type]}</option>
			{/each}
		</select>
		{#if contentType === 'office'}
			<p class="mt-2 text-sm text-base-content/60">
				Office preview uses Microsoft&apos;s online viewer and only works for public
				<code class="text-xs">https://</code> URLs. Internal or <code class="text-xs">http://</code>
				links show a download card instead — use PDF content type for in-browser viewing on your LAN.
			</p>
		{/if}
	</div>

	{#if isInlineContent}
		<MarkdownEditor bind:value={content} />
	{:else}
		<div class="space-y-2">
			<label class="label py-0" for="mediaUrl">
				<span class="label-text font-medium">Media URL</span>
			</label>
			<input
				id="mediaUrl"
				name="mediaUrl"
				type="text"
				inputmode="url"
				autocomplete="url"
				class="input input-bordered w-full"
				bind:value={mediaUrl}
				onblur={handleMediaUrlBlur}
				placeholder="http://10.100.100.67:1025/api/public/files/example"
				{disabled}
			/>
			<p class="text-sm text-base-content/60">
				Direct file link using <code class="text-xs">http://</code> or
				<code class="text-xs">https://</code>
				(LAN IPs, internal APIs, S3, CDN, etc.). Must be reachable from the visitor&apos;s browser; if
				this site uses HTTPS, HTTP media may be blocked as mixed content.
			</p>
			{#if mediaUrlError}
				<p class="text-sm text-error">{mediaUrlError}</p>
			{/if}
		</div>

		{#if mediaUrl.trim()}
			{#if officeEmbedUnavailable}
				<div class="alert alert-info">
					<span>
						This URL cannot use Microsoft&apos;s Office embed. Visitors will see an open/download
						card. For in-page viewing on your network, export the file as PDF and choose PDF.
					</span>
				</div>
			{/if}
			<div class="space-y-2">
				<h3 class="text-sm font-medium text-base-content/70">Preview</h3>
				<DocMediaViewer
					{contentType}
					mediaUrl={mediaUrl.trim()}
					embedSrc={contentType === 'pdf' ? pdfEmbedSrc : null}
					{excerpt}
					{notesHtml}
				/>
			</div>
		{/if}

		<div class="space-y-2">
			<h3 class="text-sm font-medium">Notes (optional)</h3>
			<p class="text-sm text-base-content/60">
				Markdown shown below the embedded media on the public page.
			</p>
			<MarkdownEditor bind:value={content} />
		</div>
	{/if}

	<input type="hidden" name="content" value={content} />
	<input type="hidden" name="contentType" value={contentType} />
	<input type="hidden" name="mediaUrl" value={isMediaContentType(contentType) ? mediaUrl : ''} />
</div>
