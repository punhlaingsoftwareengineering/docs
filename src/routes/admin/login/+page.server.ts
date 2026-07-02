import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { isAdminUser, isBootstrap } from '$lib/server/users';

const oauthErrors: Record<string, string> = {
	signup_disabled: 'Registration is by invitation only.',
	unable_to_get_user_info:
		'GitHub sign-in could not reach api.github.com. Create your admin account with email below instead.',
	invalid_code: 'GitHub sign-in expired. Please try again.',
	email_not_found:
		'GitHub did not return an email for this account. Make sure your GitHub email is visible to the OAuth app.',
	state_mismatch: 'GitHub sign-in could not be verified. Please try again.',
	no_code: 'GitHub sign-in was cancelled or incomplete. Please try again.'
};

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		if (isAdminUser(event.locals.user)) {
			return redirect(302, '/admin');
		}

		await auth.api.signOut({ headers: event.request.headers });
	}

	const bootstrap = await isBootstrap();
	const error = event.url.searchParams.get('error');
	const errorDescription = event.url.searchParams.get('error_description');

	return {
		isBootstrap: bootstrap,
		error:
			oauthErrors[error ?? ''] ??
			(errorDescription ? decodeURIComponent(errorDescription.replace(/\+/g, ' ')) : null) ??
			(error ? 'GitHub sign-in failed. Please try again.' : null)
	};
};
