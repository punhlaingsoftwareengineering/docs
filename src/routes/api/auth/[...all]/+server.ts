import { auth } from '$lib/server/auth';
import type { RequestHandler } from './$types';

const handleAuth: RequestHandler = ({ request }) => auth.handler(request);

export const GET = handleAuth;
export const POST = handleAuth;
export const PUT = handleAuth;
export const PATCH = handleAuth;
export const DELETE = handleAuth;
