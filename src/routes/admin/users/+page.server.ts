import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	inviteEmailSchema,
	removeAdminSchema,
	revokeInvitationSchema
} from '$lib/schemas/invitation';
import { requireAdmin } from '$lib/server/auth-guards';
import { sendInvitationEmail } from '$lib/server/email/send-invitation';
import {
	countAdminUsers,
	createInvitation,
	listAdminUsers,
	listInvitations,
	removeAdminUser,
	revokeInvitation
} from '$lib/server/services/invitations';

export const load: PageServerLoad = async (event) => {
	requireAdmin(event);

	const [admins, invitations] = await Promise.all([listAdminUsers(), listInvitations()]);

	return {
		admins,
		invitations,
		currentUserId: event.locals.user!.id
	};
};

export const actions: Actions = {
	invite: async (event) => {
		requireAdmin(event);
		const formData = await event.request.formData();
		const parsed = inviteEmailSchema.safeParse({ email: formData.get('email') });

		if (!parsed.success) {
			return fail(400, {
				message: parsed.error.flatten().formErrors[0] ?? 'Enter a valid email address.',
				action: 'invite'
			});
		}

		try {
			const invitation = await createInvitation(parsed.data.email, event.locals.user!.id);
			const emailResult = await sendInvitationEmail(invitation.email, invitation.token);

			return {
				success: true,
				action: 'invite',
				inviteUrl: emailResult.inviteUrl,
				emailSent: emailResult.sent,
				email: invitation.email,
				message: emailResult.sent
					? `Invitation sent to ${invitation.email}.`
					: (emailResult.error ??
						`Invitation created for ${invitation.email}. Copy the link below to share it.`)
			};
		} catch (error) {
			return fail(400, {
				message: error instanceof Error ? error.message : 'Could not create invitation.',
				action: 'invite'
			});
		}
	},

	revoke: async (event) => {
		requireAdmin(event);
		const formData = await event.request.formData();
		const parsed = revokeInvitationSchema.safeParse({ id: formData.get('id') });

		if (!parsed.success) {
			return fail(400, { message: 'Invalid invitation.', action: 'revoke' });
		}

		await revokeInvitation(parsed.data.id);
		return { success: true, action: 'revoke', message: 'Invitation revoked.' };
	},

	removeAdmin: async (event) => {
		requireAdmin(event);
		const formData = await event.request.formData();
		const parsed = removeAdminSchema.safeParse({ userId: formData.get('userId') });

		if (!parsed.success) {
			return fail(400, { message: 'Invalid user.', action: 'removeAdmin' });
		}

		if (parsed.data.userId === event.locals.user!.id) {
			return fail(400, { message: 'You cannot remove your own account.', action: 'removeAdmin' });
		}

		const adminCount = await countAdminUsers();
		if (adminCount <= 1) {
			return fail(400, {
				message: 'You cannot remove the last admin account.',
				action: 'removeAdmin'
			});
		}

		await removeAdminUser(parsed.data.userId);
		return { success: true, action: 'removeAdmin', message: 'Admin access removed.' };
	}
};
