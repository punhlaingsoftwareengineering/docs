import { dev } from '$app/environment';

function formatDbError(error: unknown): string {
	if (!error || typeof error !== 'object') {
		return String(error);
	}

	// node-postgres + many libs use `code` for stable error identifiers (e.g. ECONNREFUSED, 28P01).
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
	return parts.length ? parts.join(' ') : 'Unknown database error';
}

export async function safeDbQuery<T>(
	context: string,
	fn: () => Promise<T>,
	fallback: T
): Promise<T> {
	try {
		return await fn();
	} catch (error) {
		// Always include a safe error summary in production to debug container connectivity
		// without leaking connection strings.
		console.error(`[db] ${context} failed: ${formatDbError(error)}`);
		if (dev) console.error(`[db] ${context} details:`, error);
		return fallback;
	}
}
