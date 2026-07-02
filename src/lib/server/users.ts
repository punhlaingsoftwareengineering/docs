import { count, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { account, user } from '$lib/server/db/auth.schema';
import { ADMIN_ROLE, USER_ROLE } from '$lib/constants/invitation';
import type { User } from '../../app.d';

export async function isBootstrap(): Promise<boolean> {
	try {
		const [result] = await db.select({ count: count() }).from(user);
		return Number(result?.count ?? 0) === 0;
	} catch {
		return true;
	}
}

export async function hasAdmin(): Promise<boolean> {
	try {
		const [result] = await db
			.select({ count: count() })
			.from(user)
			.where(eq(user.role, ADMIN_ROLE));
		return Number(result?.count ?? 0) > 0;
	} catch {
		return false;
	}
}

export function isAdminUser(user: User | undefined | null): user is User {
	return Boolean(user && user.role === ADMIN_ROLE && !user.banned);
}

export function isRegularUser(user: User | undefined | null): user is User {
	return Boolean(user && user.role === USER_ROLE && !user.banned);
}

export async function userHasCredentialPassword(userId: string): Promise<boolean> {
	const accounts = await db.select().from(account).where(eq(account.userId, userId));
	return accounts.some((entry) => entry.providerId === 'credential' && Boolean(entry.password));
}
