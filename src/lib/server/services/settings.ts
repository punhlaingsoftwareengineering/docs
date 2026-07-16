import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { safeDbQuery } from '$lib/server/db/safe-query';
import { defaultSiteSettings } from '$lib/server/defaults/site-settings';
import { siteSettings } from '$lib/server/db/schema';
import type { SettingsFormInput } from '$lib/schemas/settings';

const DEFAULT_ID = 'default';

async function fetchSiteSettings() {
	const [row] = await db
		.select()
		.from(siteSettings)
		.where(eq(siteSettings.id, DEFAULT_ID))
		.limit(1);
	if (row) return row;

	await db.insert(siteSettings).values({ id: DEFAULT_ID }).onConflictDoNothing();
	const [created] = await db
		.select()
		.from(siteSettings)
		.where(eq(siteSettings.id, DEFAULT_ID))
		.limit(1);
	return created ?? defaultSiteSettings();
}

export async function getSiteSettings() {
	return safeDbQuery('getSiteSettings', fetchSiteSettings, defaultSiteSettings());
}

export async function updateSiteSettings(data: SettingsFormInput) {
	const [row] = await db
		.update(siteSettings)
		.set({
			siteTitle: data.siteTitle,
			tagline: data.tagline,
			copyrightNotice: data.copyrightNotice,
			footerSocialEnabled: data.footerSocialEnabled,
			footerSocialLinks: data.footerSocialLinks,
			navLinksEnabled: data.navLinksEnabled,
			navLinks: data.navLinks,
			metaDescription: data.metaDescription,
			heroTitle: data.heroTitle,
			heroSubtitle: data.heroSubtitle,
			heroPrimaryCta: data.heroPrimaryCta,
			heroPrimaryUrl: data.heroPrimaryUrl,
			heroSecondaryCta: data.heroSecondaryCta,
			heroSecondaryUrl: data.heroSecondaryUrl,
			heroSearchPlaceholder: data.heroSearchPlaceholder,
			techStackHeading: data.techStackHeading,
			techStackItems: data.techStackItems,
			featuresHeading: data.featuresHeading,
			featuresSubtitle: data.featuresSubtitle,
			codePreviewHeading: data.codePreviewHeading,
			codePreviewSubtitle: data.codePreviewSubtitle,
			welcomeVideoUrl: data.welcomeVideoUrl,
			docsCategoriesHeading: data.docsCategoriesHeading,
			docsCategoriesSubtitle: data.docsCategoriesSubtitle,
			docsCategoriesCtaLabel: data.docsCategoriesCtaLabel,
			docsCategoriesCtaUrl: data.docsCategoriesCtaUrl,
			docsCategoryDescriptions: data.docsCategoryDescriptions,
			landingCtaHeading: data.landingCtaHeading,
			landingCtaSubtitle: data.landingCtaSubtitle,
			landingCtaPrimaryLabel: data.landingCtaPrimaryLabel,
			landingCtaPrimaryUrl: data.landingCtaPrimaryUrl,
			landingCtaSecondaryLabel: data.landingCtaSecondaryLabel,
			landingCtaSecondaryUrl: data.landingCtaSecondaryUrl,
			defaultPublished: data.defaultPublished,
			defaultTheme: data.defaultTheme
		})
		.where(eq(siteSettings.id, DEFAULT_ID))
		.returning();

	return row;
}
