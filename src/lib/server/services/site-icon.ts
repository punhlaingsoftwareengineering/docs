import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/db/schema';

const DEFAULT_ID = 'default';

const ALLOWED_MIME_TYPES = new Set([
	'image/png',
	'image/jpeg',
	'image/webp',
	'image/svg+xml',
	'image/x-icon',
	'image/vnd.microsoft.icon'
]);

const MAX_BYTES = 512 * 1024;

export function validateSiteIconFile(file: File) {
	if (!ALLOWED_MIME_TYPES.has(file.type)) {
		return 'Icon must be PNG, JPEG, WebP, SVG, or ICO.';
	}
	if (file.size > MAX_BYTES) {
		return 'Icon must be 512 KB or smaller.';
	}
	return null;
}

export async function saveSiteIcon(file: File) {
	const validationError = validateSiteIconFile(file);
	if (validationError) throw new Error(validationError);

	const buffer = Buffer.from(await file.arrayBuffer());
	const [row] = await db
		.update(siteSettings)
		.set({
			siteIconMime: file.type,
			siteIconData: buffer.toString('base64')
		})
		.where(eq(siteSettings.id, DEFAULT_ID))
		.returning();

	if (!row) throw new Error('Site settings not found.');
	return row;
}

export async function clearSiteIcon() {
	const [row] = await db
		.update(siteSettings)
		.set({
			siteIconMime: null,
			siteIconData: null
		})
		.where(eq(siteSettings.id, DEFAULT_ID))
		.returning();

	if (!row) throw new Error('Site settings not found.');
	return row;
}

export async function getSiteIconPayload() {
	const [row] = await db
		.select({
			siteIconMime: siteSettings.siteIconMime,
			siteIconData: siteSettings.siteIconData
		})
		.from(siteSettings)
		.where(eq(siteSettings.id, DEFAULT_ID))
		.limit(1);

	if (!row?.siteIconMime || !row.siteIconData) return null;

	return {
		mime: row.siteIconMime,
		body: Buffer.from(row.siteIconData, 'base64')
	};
}
