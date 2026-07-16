import { error } from '@sveltejs/kit';
import { DrivePortalNotConfiguredError } from '$lib/server/drive-portal-client';

function formatDriveErrorMessage(e: unknown): string {
	if (!(e instanceof Error)) return 'Drive request failed';
	const cause =
		e.cause instanceof Error
			? e.cause.message
			: typeof e.cause === 'string'
				? e.cause
				: '';
	if (cause && cause !== e.message) return `${e.message}: ${cause}`;
	return e.message;
}

export function handleDrivePortalError(e: unknown): never {
	if (e instanceof DrivePortalNotConfiguredError) {
		throw error(503, e.message);
	}
	throw error(502, formatDriveErrorMessage(e));
}
