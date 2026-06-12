import type { LandingFeature } from '$lib/types/landing';

export const DEFAULT_HERO_SEARCH_PLACEHOLDER = 'Search documentation…';

export const DEFAULT_TECH_STACK_HEADING = 'Powered by a modern docs stack';

export const DEFAULT_TECH_STACK_ITEMS = [
	'SvelteKit',
	'Markdown',
	'Drizzle',
	'Better Auth',
	'Tailwind',
	'daisyUI'
] as const;

export const DEFAULT_FEATURES_HEADING = 'Everything you need to ship';

export const DEFAULT_FEATURES_SUBTITLE =
	'Organized sections for learning, building, and maintaining software — from first install to production.';

export const DEFAULT_FEATURES_ITEMS: LandingFeature[] = [
	{
		title: 'Guides',
		description: 'Step-by-step walkthroughs for common workflows and integrations.',
		badge: 'Learn',
		href: '/docs'
	},
	{
		title: 'API Reference',
		description: 'Endpoints, parameters, and response shapes documented in one place.',
		badge: 'Reference',
		href: '/docs'
	},
	{
		title: 'Examples',
		description: 'Copy-paste snippets and real-world patterns you can adapt quickly.',
		badge: 'Code',
		href: '/docs'
	},
	{
		title: 'Quickstart',
		description: 'Get from zero to a working setup in minutes with a focused checklist.',
		badge: 'Start',
		href: '/docs'
	},
	{
		title: 'Changelog',
		description: 'Track releases, breaking changes, and migration notes over time.',
		badge: 'Updates',
		href: '/docs'
	},
	{
		title: 'Admin tools',
		description: 'Create, edit, and publish markdown pages from the in-browser admin CMS.',
		badge: 'Admin',
		href: '/admin'
	}
];

export const DEFAULT_CODE_PREVIEW_HEADING = 'Markdown-first content';

export const DEFAULT_CODE_PREVIEW_SUBTITLE =
	'Write docs in plain markdown through the admin CMS. Published pages power public documentation, search, and navigation.';

export const DEFAULT_CODE_PREVIEW_TERMINAL_LABEL = 'admin — documents';

export const DEFAULT_CODE_PREVIEW_LINES = [
	'$ open /admin/documents',
	'',
	'# Introduction',
	'',
	'Welcome to your documentation site. Write markdown',
	'in the admin editor — stored in Postgres and published',
	'to `/docs/` with search and nested navigation.',
	'',
	'## Local setup',
	'',
	'```bash',
	'pnpm install',
	'pnpm dev',
	'```'
];

export const DEFAULT_DOCS_CATEGORIES_HEADING = 'Browse by category';

export const DEFAULT_DOCS_CATEGORIES_SUBTITLE =
	'Jump into the section that matches what you are trying to do right now.';

export const DEFAULT_DOCS_CATEGORIES_CTA_LABEL = 'View all docs';

export const DEFAULT_DOCS_CATEGORIES_CTA_URL = '/docs';

export const DEFAULT_DOCS_CATEGORY_DESCRIPTIONS: Record<string, string> = {
	'getting-started': 'Install, configure, and publish your first doc page.',
	guides: 'Deep dives into workflows, auth, deployment, and content management.',
	reference: 'API endpoints, schemas, environment variables, and CLI commands.',
	examples: 'Recipes and sample projects to copy and adapt.',
	changelog: 'Version history, deprecations, and upgrade paths.'
};

export const DEFAULT_LANDING_CTA_HEADING = 'Ready to dive in?';

export const DEFAULT_LANDING_CTA_SUBTITLE =
	'Start with the getting started guide or jump straight into the reference. Everything is written in markdown and built for developers.';

export const DEFAULT_LANDING_CTA_PRIMARY_LABEL = 'Read the docs';

export const DEFAULT_LANDING_CTA_PRIMARY_URL = '/docs';

export const DEFAULT_LANDING_CTA_SECONDARY_LABEL = 'Admin area';

export const DEFAULT_LANDING_CTA_SECONDARY_URL = '/admin';
