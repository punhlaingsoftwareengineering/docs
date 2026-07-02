import { INVITE_TOKEN_COOKIE } from '$lib/constants/invitation';

type InviteHookContext = {
	request?: Request | null;
};

export function getInviteTokenFromContext(
	context: InviteHookContext | null | undefined
): string | null {
	if (!context?.request) return null;
	const cookieHeader = context.request.headers.get('cookie');
	if (!cookieHeader) return null;

	for (const part of cookieHeader.split(';')) {
		const [name, ...rest] = part.trim().split('=');
		if (name === INVITE_TOKEN_COOKIE) {
			return decodeURIComponent(rest.join('='));
		}
	}

	return null;
}
