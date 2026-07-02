import {
	DEFAULT_DOCS_CATEGORIES_CTA_LABEL,
	DEFAULT_DOCS_CATEGORIES_CTA_URL,
	DEFAULT_DOCS_CATEGORIES_HEADING,
	DEFAULT_DOCS_CATEGORIES_SUBTITLE,
	DEFAULT_DOCS_CATEGORY_DESCRIPTIONS,
	DEFAULT_FEATURES_HEADING,
	DEFAULT_FEATURES_ITEMS,
	DEFAULT_FEATURES_SUBTITLE,
	DEFAULT_HERO_SEARCH_PLACEHOLDER,
	DEFAULT_LANDING_CTA_HEADING,
	DEFAULT_LANDING_CTA_PRIMARY_LABEL,
	DEFAULT_LANDING_CTA_PRIMARY_URL,
	DEFAULT_LANDING_CTA_SECONDARY_LABEL,
	DEFAULT_LANDING_CTA_SECONDARY_URL,
	DEFAULT_LANDING_CTA_SUBTITLE,
	DEFAULT_TECH_STACK_HEADING,
	DEFAULT_TECH_STACK_ITEMS,
	DEFAULT_WELCOME_VIDEO_HEADING,
	DEFAULT_WELCOME_VIDEO_SUBTITLE,
	DEFAULT_WELCOME_VIDEO_URL
} from '$lib/landing/defaults';
import type { siteSettings } from '$lib/server/db/schema';
import type { LandingFeature, ResolvedLandingSettings } from '$lib/types/landing';

type SiteSettingsRow = typeof siteSettings.$inferSelect;

function resolveFeatures(items: LandingFeature[] | null | undefined): LandingFeature[] {
	if (!items?.length) return [...DEFAULT_FEATURES_ITEMS];
	return items;
}

export function resolveLandingSettings(settings: SiteSettingsRow): ResolvedLandingSettings {
	return {
		heroSearchPlaceholder: settings.heroSearchPlaceholder ?? DEFAULT_HERO_SEARCH_PLACEHOLDER,
		techStack: {
			heading: settings.techStackHeading ?? DEFAULT_TECH_STACK_HEADING,
			items: settings.techStackItems?.length
				? settings.techStackItems
				: [...DEFAULT_TECH_STACK_ITEMS]
		},
		features: {
			heading: settings.featuresHeading ?? DEFAULT_FEATURES_HEADING,
			subtitle: settings.featuresSubtitle ?? DEFAULT_FEATURES_SUBTITLE,
			items: resolveFeatures(settings.featuresItems ?? undefined)
		},
		codePreview: {
			heading: settings.codePreviewHeading ?? DEFAULT_WELCOME_VIDEO_HEADING,
			subtitle: settings.codePreviewSubtitle ?? DEFAULT_WELCOME_VIDEO_SUBTITLE,
			videoUrl: settings.welcomeVideoUrl?.trim() || DEFAULT_WELCOME_VIDEO_URL
		},
		docsCategories: {
			heading: settings.docsCategoriesHeading ?? DEFAULT_DOCS_CATEGORIES_HEADING,
			subtitle: settings.docsCategoriesSubtitle ?? DEFAULT_DOCS_CATEGORIES_SUBTITLE,
			ctaLabel: settings.docsCategoriesCtaLabel ?? DEFAULT_DOCS_CATEGORIES_CTA_LABEL,
			ctaUrl: settings.docsCategoriesCtaUrl ?? DEFAULT_DOCS_CATEGORIES_CTA_URL,
			descriptions: {
				...DEFAULT_DOCS_CATEGORY_DESCRIPTIONS,
				...(settings.docsCategoryDescriptions ?? {})
			}
		},
		cta: {
			heading: settings.landingCtaHeading ?? DEFAULT_LANDING_CTA_HEADING,
			subtitle: settings.landingCtaSubtitle ?? DEFAULT_LANDING_CTA_SUBTITLE,
			primaryLabel: settings.landingCtaPrimaryLabel ?? DEFAULT_LANDING_CTA_PRIMARY_LABEL,
			primaryUrl: settings.landingCtaPrimaryUrl ?? DEFAULT_LANDING_CTA_PRIMARY_URL,
			secondaryLabel: settings.landingCtaSecondaryLabel ?? DEFAULT_LANDING_CTA_SECONDARY_LABEL,
			secondaryUrl: settings.landingCtaSecondaryUrl ?? DEFAULT_LANDING_CTA_SECONDARY_URL
		}
	};
}

export function parseTechStackItems(raw: string): string[] {
	return raw
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);
}

export function formatTechStackItems(items: string[]): string {
	return items.join('\n');
}

export function landingSettingsFormValues(settings: SiteSettingsRow) {
	const landing = resolveLandingSettings(settings);

	return {
		heroSearchPlaceholder: landing.heroSearchPlaceholder,
		techStackHeading: landing.techStack.heading,
		techStackItems: formatTechStackItems(landing.techStack.items),
		featuresHeading: landing.features.heading,
		featuresSubtitle: landing.features.subtitle,
		codePreviewHeading: landing.codePreview.heading,
		codePreviewSubtitle: landing.codePreview.subtitle,
		welcomeVideoUrl: landing.codePreview.videoUrl,
		docsCategoriesHeading: landing.docsCategories.heading,
		docsCategoriesSubtitle: landing.docsCategories.subtitle,
		docsCategoriesCtaLabel: landing.docsCategories.ctaLabel,
		docsCategoriesCtaUrl: landing.docsCategories.ctaUrl,
		docsCategoryDescriptions: JSON.stringify(landing.docsCategories.descriptions, null, 2),
		landingCtaHeading: landing.cta.heading,
		landingCtaSubtitle: landing.cta.subtitle,
		landingCtaPrimaryLabel: landing.cta.primaryLabel,
		landingCtaPrimaryUrl: landing.cta.primaryUrl,
		landingCtaSecondaryLabel: landing.cta.secondaryLabel,
		landingCtaSecondaryUrl: landing.cta.secondaryUrl
	};
}
