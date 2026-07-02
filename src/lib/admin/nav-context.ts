import { getContext, setContext } from 'svelte';

const ADMIN_NAV_KEY = Symbol('admin-nav');

export type AdminNavContext = {
	open: () => void;
	close: () => void;
};

export function setAdminNavContext(ctx: AdminNavContext) {
	setContext(ADMIN_NAV_KEY, ctx);
}

export function getAdminNavContext(): AdminNavContext | undefined {
	return getContext<AdminNavContext>(ADMIN_NAV_KEY);
}
