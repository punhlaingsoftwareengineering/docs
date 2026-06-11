import { count } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/auth.schema';

export async function hasAdmin(): Promise<boolean> {
	try {
		const [result] = await db.select({ count: count() }).from(user);
		return Number(result?.count ?? 0) > 0;
	} catch {
		return false;
	}
}
