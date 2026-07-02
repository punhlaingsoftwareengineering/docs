import { z } from 'zod';

export const inviteEmailSchema = z.object({
	email: z.string().trim().email().max(255)
});

export const revokeInvitationSchema = z.object({
	id: z.string().uuid()
});

export const removeAdminSchema = z.object({
	userId: z.string().min(1)
});
