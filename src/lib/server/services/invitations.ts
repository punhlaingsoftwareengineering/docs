import { randomBytes } from 'node:crypto';
import { and, count, desc, eq, gt, isNull, sql } from 'drizzle-orm';
import { INVITE_EXPIRY_DAYS, ADMIN_ROLE } from '$lib/constants/invitation';
import { db } from '$lib/server/db';
import { adminInvitation } from '$lib/server/db/schema';
import { user } from '$lib/server/db/auth.schema';

function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

function isPending(invite: typeof adminInvitation.$inferSelect) {
	return !invite.acceptedAt && !invite.revokedAt && invite.expiresAt > new Date();
}

export async function createInvitation(email: string, invitedByUserId: string) {
	const normalizedEmail = normalizeEmail(email);

	const [existingAdmin] = await db
		.select({ id: user.id })
		.from(user)
		.where(and(eq(sql`lower(${user.email})`, normalizedEmail), eq(user.role, ADMIN_ROLE)))
		.limit(1);

	if (existingAdmin) {
		throw new Error('This email already has admin access.');
	}

	const pending = await db
		.select()
		.from(adminInvitation)
		.where(
			and(
				eq(sql`lower(${adminInvitation.email})`, normalizedEmail),
				isNull(adminInvitation.acceptedAt),
				isNull(adminInvitation.revokedAt),
				gt(adminInvitation.expiresAt, new Date())
			)
		)
		.limit(1);

	if (pending[0]) {
		return pending[0];
	}

	const token = randomBytes(32).toString('base64url');
	const expiresAt = new Date(Date.now() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

	const [created] = await db
		.insert(adminInvitation)
		.values({
			email: normalizedEmail,
			token,
			invitedByUserId,
			expiresAt
		})
		.returning();

	return created;
}

export async function getInvitationByToken(token: string) {
	const [invite] = await db
		.select()
		.from(adminInvitation)
		.where(eq(adminInvitation.token, token))
		.limit(1);

	if (!invite || !isPending(invite)) return null;
	return invite;
}

export async function getPendingInvitationByEmail(email: string) {
	const normalizedEmail = normalizeEmail(email);
	const [invite] = await db
		.select()
		.from(adminInvitation)
		.where(
			and(
				eq(sql`lower(${adminInvitation.email})`, normalizedEmail),
				isNull(adminInvitation.acceptedAt),
				isNull(adminInvitation.revokedAt),
				gt(adminInvitation.expiresAt, new Date())
			)
		)
		.limit(1);

	return invite ?? null;
}

export async function acceptInvitation(invitationId: string, email: string) {
	const normalizedEmail = normalizeEmail(email);
	const [invite] = await db
		.select()
		.from(adminInvitation)
		.where(eq(adminInvitation.id, invitationId))
		.limit(1);

	if (!invite || !isPending(invite) || normalizeEmail(invite.email) !== normalizedEmail) {
		throw new Error('Invitation is invalid or expired.');
	}

	await db
		.update(adminInvitation)
		.set({ acceptedAt: new Date() })
		.where(eq(adminInvitation.id, invitationId));
}

export async function revokeInvitation(id: string) {
	await db
		.update(adminInvitation)
		.set({ revokedAt: new Date() })
		.where(and(eq(adminInvitation.id, id), isNull(adminInvitation.acceptedAt)));
}

export async function listInvitations() {
	return db.select().from(adminInvitation).orderBy(desc(adminInvitation.createdAt));
}

export async function listAdminUsers() {
	return db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image,
			twoFactorEnabled: user.twoFactorEnabled,
			createdAt: user.createdAt
		})
		.from(user)
		.where(eq(user.role, ADMIN_ROLE))
		.orderBy(user.createdAt);
}

export async function countAdminUsers() {
	const [result] = await db.select({ count: count() }).from(user).where(eq(user.role, ADMIN_ROLE));
	return Number(result?.count ?? 0);
}

export async function removeAdminUser(userId: string) {
	await db.delete(user).where(eq(user.id, userId));
}
