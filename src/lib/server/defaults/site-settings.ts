import type { siteSettings } from '$lib/server/db/schema';

export type SiteSettingsRow = typeof siteSettings.$inferSelect;

export function defaultSiteSettings(): SiteSettingsRow {
	return {
		id: 'default',
		siteTitle: 'zarnihlawn docs',
		tagline: 'Software documentation',
		metaDescription: 'Guides, API reference, and examples for personal software projects.',
		heroTitle: 'Build faster with clear, practical docs',
		heroSubtitle:
			'Guides, API reference, and examples for personal software projects — structured like the dev tools you already know and love.',
		heroPrimaryCta: 'Browse documentation',
		heroPrimaryUrl: '/docs',
		heroSecondaryCta: 'Admin sign in',
		heroSecondaryUrl: '/admin',
		heroSearchPlaceholder: null,
		techStackHeading: null,
		techStackItems: null,
		featuresHeading: null,
		featuresSubtitle: null,
		featuresItems: null,
		codePreviewHeading: null,
		codePreviewSubtitle: null,
		codePreviewTerminalLabel: null,
		codePreviewLines: null,
		welcomeVideoUrl: null,
		docsCategoriesHeading: null,
		docsCategoriesSubtitle: null,
		docsCategoriesCtaLabel: null,
		docsCategoriesCtaUrl: null,
		docsCategoryDescriptions: null,
		landingCtaHeading: null,
		landingCtaSubtitle: null,
		landingCtaPrimaryLabel: null,
		landingCtaPrimaryUrl: null,
		landingCtaSecondaryLabel: null,
		landingCtaSecondaryUrl: null,
		defaultPublished: false,
		defaultTheme: 'system',
		siteIconMime: null,
		siteIconData: null,
		copyrightNotice: 'zarnihlawn.com',
		footerSocialEnabled: false,
		footerSocialLinks: null,
		navLinksEnabled: false,
		navLinks: null,
		updatedAt: new Date()
	};
}
