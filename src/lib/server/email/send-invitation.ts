import { ORIGIN } from '$app/env/private';
import { PUBLIC_APP_NAME } from '$app/env/public';
import { createSmtpTransport, getEmailFromAddress, isSmtpConfigured } from '$lib/server/email/smtp';

export type SendInvitationResult = {
	sent: boolean;
	inviteUrl: string;
	error?: string;
};

export async function sendInvitationEmail(
	email: string,
	token: string
): Promise<SendInvitationResult> {
	const inviteUrl = `${ORIGIN}/invite/${token}`;

	if (!isSmtpConfigured()) {
		console.warn('SMTP_USER / SMTP_PASS are not set; invitation email was not sent.');
		return { sent: false, inviteUrl };
	}

	const transporter = createSmtpTransport();
	const from = getEmailFromAddress();

	try {
		await transporter.sendMail({
			from,
			to: email,
			subject: `You're invited to ${PUBLIC_APP_NAME}`,
			text: [
				`You have been invited to join the ${PUBLIC_APP_NAME} admin team.`,
				`Accept your invitation: ${inviteUrl}`,
				'This link expires in 7 days. If you did not expect this email, you can ignore it.'
			].join('\n\n'),
			html: `
				<p>You have been invited to join the ${PUBLIC_APP_NAME} admin team.</p>
				<p><a href="${inviteUrl}">Accept your invitation</a></p>
				<p>This link expires in 7 days. If you did not expect this email, you can ignore it.</p>
			`
		});
	} catch (error) {
		console.error('SMTP send error:', error);
		return {
			sent: false,
			inviteUrl,
			error: 'Could not send invitation email. Share the invite link manually.'
		};
	}

	return { sent: true, inviteUrl };
}
