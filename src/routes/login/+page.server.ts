import { fail, isRedirect, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { hasAdmin } from '$lib/server/users';
import { APIError } from 'better-auth/api';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/admin');
	}

	const adminExists = await hasAdmin();
	const error = event.url.searchParams.get('error');

	return {
		hasAdmin: adminExists,
		error: error === 'signup_disabled' ? 'Only the site owner can sign in with GitHub.' : null
	};
};

export const actions: Actions = {
	signInGithub: async (event) => {
		const formData = await event.request.formData();
		const requestSignUp = formData.get('requestSignUp') === 'true';
		const adminExists = await hasAdmin();

		if (requestSignUp && adminExists) {
			return fail(400, {
				message: 'An admin account already exists. Sign in with GitHub instead.'
			});
		}

		if (!requestSignUp && !adminExists) {
			return fail(400, {
				message: 'Create the admin account first using Sign up with GitHub.'
			});
		}

		try {
			const result = await auth.api.signInSocial({
				body: {
					provider: 'github',
					callbackURL: '/admin',
					requestSignUp
				},
				headers: event.request.headers
			});

			if (result.url) {
				return redirect(302, result.url);
			}

			return fail(400, { message: 'Could not start GitHub sign-in.' });
		} catch (error) {
			if (isRedirect(error)) throw error;
			if (error instanceof APIError) {
				return fail(400, { message: error.message || 'GitHub sign-in failed' });
			}
			console.error('GitHub sign-in failed:', error);
			return fail(500, { message: 'Could not start GitHub sign-in. Check server logs.' });
		}
	}
};
