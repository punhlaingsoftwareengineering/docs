type GithubProfile = {
	id: number;
	login: string;
	name: string | null;
	email: string | null;
	avatar_url: string;
};

type GithubEmail = {
	email: string;
	primary: boolean;
	verified: boolean;
};

async function githubFetch<T>(url: string, accessToken: string): Promise<T> {
	const headers = {
		Authorization: `Bearer ${accessToken}`,
		Accept: 'application/vnd.github+json',
		'User-Agent': 'docs-auth'
	};

	let lastError: unknown;
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			const response = await fetch(url, { headers });
			if (!response.ok) {
				throw new Error(`GitHub API responded with ${response.status}`);
			}
			return (await response.json()) as T;
		} catch (error) {
			lastError = error;
			if (attempt < 2) {
				await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
			}
		}
	}

	throw lastError;
}

export async function fetchGithubUserInfo(accessToken: string) {
	const profile = await githubFetch<GithubProfile>('https://api.github.com/user', accessToken);

	let email = profile.email;
	let emailVerified = false;

	try {
		const emails = await githubFetch<GithubEmail[]>(
			'https://api.github.com/user/emails',
			accessToken
		);
		if (!email) {
			email = (emails.find((entry) => entry.primary) ?? emails[0])?.email ?? null;
		}
		emailVerified = emails.find((entry) => entry.email === email)?.verified ?? false;
	} catch (error) {
		console.error('GitHub email lookup failed:', error);
	}

	return {
		user: {
			id: String(profile.id),
			name: profile.name || profile.login,
			email,
			image: profile.avatar_url,
			emailVerified
		},
		data: profile
	};
}
