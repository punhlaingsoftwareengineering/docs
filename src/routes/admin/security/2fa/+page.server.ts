import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userHasCredentialPassword } from '$lib/server/users';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/admin/login');
	}

	if (event.locals.user.twoFactorEnabled) {
		return redirect(302, '/admin');
	}

	const hasCredentialPassword = await userHasCredentialPassword(event.locals.user.id);

	return {
		user: event.locals.user,
		hasCredentialPassword
	};
};
