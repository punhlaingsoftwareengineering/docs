import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { INVITE_TOKEN_COOKIE } from '$lib/constants/invitation';
import { isAdminUser } from '$lib/server/users';
import { getInvitationByToken } from '$lib/server/services/invitations';

export const load: PageServerLoad = async (event) => {
	const { token } = event.params;

	if (isAdminUser(event.locals.user)) {
		return redirect(302, '/admin');
	}

	const invitation = await getInvitationByToken(token);

	if (invitation) {
		event.cookies.set(INVITE_TOKEN_COOKIE, token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: event.url.protocol === 'https:',
			maxAge: 60 * 60 * 24
		});
	}

	return {
		token,
		invitation,
		invalid: !invitation,
		email: invitation?.email ?? ''
	};
};

export const actions: Actions = {
	clearInviteCookie: async (event) => {
		event.cookies.delete(INVITE_TOKEN_COOKIE, { path: '/' });
		return { cleared: true };
	}
};
