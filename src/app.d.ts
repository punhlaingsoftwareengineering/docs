import type { User as BetterAuthUser, Session } from 'better-auth';

export type User = BetterAuthUser;

declare global {
	namespace App {
		interface Locals {
			user?: User;
			session?: Session;
			authUnavailable?: boolean;
		}
	}
}

export {};
