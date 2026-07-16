import { ORIGIN as ORIGIN_ENV } from '$app/env/private';

/** Public site URL from `ORIGIN` (no trailing slash). */
export function getConfiguredOrigin(): string | undefined {
	const fromEnv =
		(typeof ORIGIN_ENV === 'string' && ORIGIN_ENV.trim() ? ORIGIN_ENV.trim() : undefined) ??
		(typeof process.env.ORIGIN === 'string' && process.env.ORIGIN.trim()
			? process.env.ORIGIN.trim()
			: undefined);
	return fromEnv?.replace(/\/$/, '');
}
