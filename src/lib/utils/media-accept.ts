import type { DocumentContentType } from '$lib/constants/document-content';

const MEDIA_ACCEPT: Partial<Record<DocumentContentType, string>> = {
	pdf: 'application/pdf,.pdf',
	video: 'video/*',
	audio: 'audio/*',
	image: 'image/*',
	office:
		'.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
};

export function mediaAcceptForContentType(contentType: DocumentContentType): string {
	return MEDIA_ACCEPT[contentType] ?? '*/*';
}
