import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { requireAdmin } from '$lib/server/auth-guards';

function isAdminLoginPath(pathname: string) {
	return pathname === '/admin/login' || pathname.startsWith('/admin/login/');
}

export const load: LayoutServerLoad = (event) => {
	if (isAdminLoginPath(event.url.pathname)) {
		return {};
	}

	requireAdmin(event);

	const user = event.locals.user!;
	const onEnrollmentPage = event.url.pathname.startsWith('/admin/security/2fa');

	if (!user.twoFactorEnabled && !onEnrollmentPage) {
		return redirect(302, '/admin/security/2fa');
	}

	return { user };
};
