import type { BetterAuthPlugin } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { APIError } from 'better-auth/api';
import { createHMAC } from '@better-auth/utils/hmac';
import { deleteSessionCookie, expireCookie } from 'better-auth/cookies';
import { generateRandomString } from 'better-auth/crypto';

const TWO_FACTOR_COOKIE_NAME = 'two_factor';
const TRUST_DEVICE_COOKIE_NAME = 'trust_device';

const DEFAULT_TWO_FACTOR_COOKIE_MAX_AGE = 600;
const DEFAULT_TRUST_DEVICE_MAX_AGE = 2592000;

type UserWithTwoFactor = {
	id: string;
	twoFactorEnabled?: boolean;
};

/**
 * Better Auth gates 2FA on email sign-in only. Mirror that for OAuth callbacks.
 */
export function oauthTwoFactorPlugin(
	trustDeviceMaxAge = DEFAULT_TRUST_DEVICE_MAX_AGE
): BetterAuthPlugin {
	return {
		id: 'oauth-two-factor',
		hooks: {
			after: [
				{
					matcher: (ctx) => ctx.path?.startsWith('/callback/') ?? false,
					handler: createAuthMiddleware(async (ctx) => {
						const data = ctx.context.newSession as
							| {
									session: { token: string };
									user: UserWithTwoFactor;
							  }
							| null
							| undefined;

						if (!data?.user.twoFactorEnabled) return;

						const trustDeviceCookieAttrs = ctx.context.createAuthCookie(TRUST_DEVICE_COOKIE_NAME, {
							maxAge: trustDeviceMaxAge
						});
						const trustDeviceCookie = await ctx.getSignedCookie(
							trustDeviceCookieAttrs.name,
							ctx.context.secret
						);

						if (trustDeviceCookie) {
							const [token, trustIdentifier] = trustDeviceCookie.split('!');
							if (token && trustIdentifier) {
								const expectedToken = await createHMAC('SHA-256', 'base64urlnopad').sign(
									ctx.context.secret,
									`${data.user.id}!${trustIdentifier}`
								);

								if (token === expectedToken) {
									const verificationRecord =
										await ctx.context.internalAdapter.findVerificationValue(trustIdentifier);

									if (
										verificationRecord &&
										verificationRecord.value === data.user.id &&
										verificationRecord.expiresAt > new Date()
									) {
										await ctx.context.internalAdapter.deleteVerificationValue(
											verificationRecord.id
										);
										const newTrustIdentifier = `trust-device-${generateRandomString(32)}`;
										const newToken = await createHMAC('SHA-256', 'base64urlnopad').sign(
											ctx.context.secret,
											`${data.user.id}!${newTrustIdentifier}`
										);
										await ctx.context.internalAdapter.createVerificationValue({
											value: data.user.id,
											identifier: newTrustIdentifier,
											expiresAt: new Date(Date.now() + trustDeviceMaxAge * 1000)
										});
										const newTrustDeviceCookie = ctx.context.createAuthCookie(
											TRUST_DEVICE_COOKIE_NAME,
											{ maxAge: trustDeviceMaxAge }
										);
										await ctx.setSignedCookie(
											newTrustDeviceCookie.name,
											`${newToken}!${newTrustIdentifier}`,
											ctx.context.secret,
											trustDeviceCookieAttrs.attributes
										);
										return;
									}
								}
							}
							expireCookie(ctx, trustDeviceCookieAttrs);
						}

						deleteSessionCookie(ctx, true);
						await ctx.context.internalAdapter.deleteSession(data.session.token);

						const maxAge = DEFAULT_TWO_FACTOR_COOKIE_MAX_AGE;
						const twoFactorCookie = ctx.context.createAuthCookie(TWO_FACTOR_COOKIE_NAME, {
							maxAge
						});
						const identifier = `2fa-${generateRandomString(20)}`;
						await ctx.context.internalAdapter.createVerificationValue({
							value: data.user.id,
							identifier,
							expiresAt: new Date(Date.now() + maxAge * 1000)
						});
						await ctx.setSignedCookie(
							twoFactorCookie.name,
							identifier,
							ctx.context.secret,
							twoFactorCookie.attributes
						);

						throw ctx.redirect('/login/two-factor');
					})
				}
			]
		}
	};
}

export function blockDisableTwoFactorPlugin(): BetterAuthPlugin {
	return {
		id: 'block-disable-two-factor',
		hooks: {
			before: [
				{
					matcher: (ctx) => ctx.path === '/two-factor/disable',
					handler: createAuthMiddleware(async () => {
						throw new APIError('FORBIDDEN', {
							message: 'Two-factor authentication cannot be disabled.'
						});
					})
				}
			]
		}
	};
}
