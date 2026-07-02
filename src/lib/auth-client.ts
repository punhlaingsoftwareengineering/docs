import { goto } from '$app/navigation';
import { createAuthClient } from 'better-auth/svelte';
import { twoFactorClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	plugins: [
		twoFactorClient({
			onTwoFactorRedirect: () => {
				void goto('/login/two-factor');
			}
		})
	]
});

export function redirectToTwoFactor() {
	void goto('/login/two-factor');
}
