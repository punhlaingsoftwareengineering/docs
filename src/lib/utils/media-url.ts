import {
	DEFAULT_DOCUMENT_CONTENT_TYPE,
	type DocumentContentType
} from '$lib/constants/document-content';

export function parseYoutubeId(url: string): string | null {
	try {
		const parsed = new URL(url);
		if (parsed.hostname === 'youtu.be') {
			const id = parsed.pathname.replace(/^\//, '');
			return id || null;
		}
		if (
			parsed.hostname.includes('youtube.com') ||
			parsed.hostname.includes('youtube-nocookie.com')
		) {
			if (parsed.pathname.startsWith('/embed/')) {
				return parsed.pathname.split('/')[2] ?? null;
			}
			return parsed.searchParams.get('v');
		}
	} catch {
		return null;
	}
	return null;
}

export function parseVimeoId(url: string): string | null {
	try {
		const parsed = new URL(url);
		if (!parsed.hostname.includes('vimeo.com')) return null;
		const match = parsed.pathname.match(/\/(\d+)/);
		return match?.[1] ?? null;
	} catch {
		return null;
	}
}

export function youtubeEmbedUrl(url: string): string | null {
	const id = parseYoutubeId(url);
	return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function vimeoEmbedUrl(url: string): string | null {
	const id = parseVimeoId(url);
	return id ? `https://player.vimeo.com/video/${id}` : null;
}

export function officeEmbedUrl(url: string): string {
	return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
}

function isPrivateOrLocalHost(hostname: string): boolean {
	const host = hostname.toLowerCase();
	if (host === 'localhost' || host.endsWith('.local')) return true;

	const parts = host.split('.').map((part) => Number(part));
	if (parts.length === 4 && parts.every((part) => !Number.isNaN(part))) {
		if (parts[0] === 10) return true;
		if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
		if (parts[0] === 192 && parts[1] === 168) return true;
		if (parts[0] === 127) return true;
	}

	return false;
}

/** Microsoft Office Online can only embed public HTTPS files it can reach from the internet. */
export function canUseOfficeOnlineEmbed(url: string): boolean {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== 'https:') return false;
		if (isPrivateOrLocalHost(parsed.hostname)) return false;
		return true;
	} catch {
		return false;
	}
}

export function getOfficeFileKind(url: string): string {
	try {
		const path = new URL(url).pathname.toLowerCase();
		if (/\.pptx?$/.test(path)) return 'PowerPoint presentation';
		if (/\.docx?$/.test(path)) return 'Word document';
		if (/\.xlsx?$/.test(path)) return 'Excel spreadsheet';
	} catch {
		// ignore
	}
	return 'Office document';
}

export function fileNameFromUrl(url: string): string {
	try {
		const name = new URL(url).pathname.split('/').pop();
		return name?.trim() || 'Download file';
	} catch {
		return 'Download file';
	}
}

export function suggestContentTypeFromUrl(url: string): DocumentContentType | null {
	try {
		const parsed = new URL(url);
		const pathname = parsed.pathname.toLowerCase();
		if (pathname.endsWith('.html') || pathname.endsWith('.htm')) return 'html';
		if (pathname.endsWith('.csv')) return 'csv';
		if (pathname.endsWith('.pdf')) return 'pdf';
		if (/\.(mp4|webm|ogg|mov)$/.test(pathname)) return 'video';
		if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(pathname)) return 'audio';
		if (/\.(png|jpe?g|gif|webp|svg|avif)$/.test(pathname)) return 'image';
		if (/\.(docx?|pptx?|xlsx?)$/.test(pathname) && canUseOfficeOnlineEmbed(url)) return 'office';
		if (parseYoutubeId(url) || parseVimeoId(url)) return 'video';
	} catch {
		return null;
	}
	return null;
}

export function isDirectVideoFile(url: string): boolean {
	try {
		return /\.(mp4|webm|ogg|mov)$/i.test(new URL(url).pathname);
	} catch {
		return false;
	}
}

export function contentTypeLabel(contentType: string): string {
	if (contentType === 'markdown') return 'Markdown';
	if (contentType === 'html') return 'HTML';
	if (contentType === 'csv') return 'CSV';
	if (contentType === 'pdf') return 'PDF';
	if (contentType === 'video') return 'Video';
	if (contentType === 'audio') return 'Audio';
	if (contentType === 'image') return 'Image';
	if (contentType === 'office') return 'Office';
	return contentType;
}

export { DEFAULT_DOCUMENT_CONTENT_TYPE };
