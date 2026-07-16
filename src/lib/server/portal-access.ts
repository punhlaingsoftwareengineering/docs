import { dev } from '$app/environment';
import { DOCS_SERVICE_ID } from '$lib/constants/docs-service';
import { portalPool } from '$lib/server/portal-db';

function formatPortalDbError(error: unknown): string {
	if (!error || typeof error !== 'object') {
		return String(error);
	}

	const code = 'code' in error && typeof (error as { code?: unknown }).code === 'string'
		? (error as { code: string }).code
		: undefined;

	const message =
		error instanceof Error
			? error.message
			: 'message' in error && typeof (error as { message?: unknown }).message === 'string'
				? (error as { message: string }).message
				: undefined;

	const parts = [code, message].filter(Boolean);
	return parts.length ? parts.join(' ') : 'Unknown portal database error';
}

export class PortalAccessUnavailableError extends Error {
	constructor(message: string, cause?: unknown) {
		super(message);
		this.name = 'PortalAccessUnavailableError';
		if (cause !== undefined) {
			(this as Error & { cause?: unknown }).cause = cause;
		}
	}
}

export async function canAccessDocsAdmin(userId: string): Promise<boolean> {
	try {
		const profileResult = await portalPool.query<{ portal_role: string }>(
			`SELECT portal_role FROM user_profile WHERE user_id = $1 LIMIT 1`,
			[userId]
		);
		const portalRole = profileResult.rows[0]?.portal_role;
		if (portalRole === 'admin') return true;

		const serviceResult = await portalPool.query<{ is_public: boolean }>(
			`SELECT is_public FROM service WHERE id = $1 LIMIT 1`,
			[DOCS_SERVICE_ID]
		);
		const service = serviceResult.rows[0];
		if (!service) return false;
		if (service.is_public) return true;

		const assignmentResult = await portalPool.query<{ ok: number }>(
			`SELECT 1 AS ok
			 FROM user_department_role udr
			 INNER JOIN access_role_service ars ON ars.role_id = udr.role_id
			 WHERE udr.user_id = $1 AND ars.service_id = $2
			 LIMIT 1`,
			[userId, DOCS_SERVICE_ID]
		);
		return assignmentResult.rows.length > 0;
	} catch (error) {
		const detail = formatPortalDbError(error);
		console.error(`[portal-access] canAccessDocsAdmin failed: ${detail}`);
		if (dev) console.error('[portal-access] canAccessDocsAdmin details:', error);
		throw new PortalAccessUnavailableError(
			`Portal database is unreachable (${detail}).`,
			error
		);
	}
}
