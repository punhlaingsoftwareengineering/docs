import { redirect, type RequestEvent } from '@sveltejs/kit';
import { isAdminUser } from '$lib/server/users';
import type { User } from '../../app.d';

export { isAdminUser };

export function requireAdmin(event: RequestEvent): User {
	const user = event.locals.user;
	if (!isAdminUser(user)) {
		return redirect(302, '/admin/login');
	}
	return user;
}

export function assertAdminApi(locals: App.Locals): User {
	const user = locals.user;
	if (!isAdminUser(user)) {
		throw new Response('Unauthorized', { status: 401 });
	}
	return user;
}
