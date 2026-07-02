import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/admin/login');
	}

	if (event.locals.user.twoFactorEnabled) {
		return redirect(302, '/admin');
	}

	if (event.locals.user && !event.locals.user.twoFactorEnabled) {
		return redirect(302, '/admin/security/2fa');
	}

	return {};
};
