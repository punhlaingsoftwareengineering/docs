export const DOCUMENT_CONTENT_TYPES = [
	'markdown',
	'html',
	'csv',
	'pdf',
	'video',
	'audio',
	'image',
	'office'
] as const;

export type DocumentContentType = (typeof DOCUMENT_CONTENT_TYPES)[number];

export const DEFAULT_DOCUMENT_CONTENT_TYPE: DocumentContentType = 'markdown';

export const DOCUMENT_CONTENT_TYPE_LABELS: Record<DocumentContentType, string> = {
	markdown: 'Markdown',
	html: 'HTML',
	csv: 'CSV',
	pdf: 'PDF',
	video: 'Video',
	audio: 'Audio',
	image: 'Image',
	office: 'Office document'
};

export function isMediaContentType(
	contentType: string
): contentType is Exclude<DocumentContentType, 'markdown'> {
	return (
		contentType === 'pdf' ||
		contentType === 'video' ||
		contentType === 'audio' ||
		contentType === 'image' ||
		contentType === 'office'
	);
}
