import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { siteSettings } from '$lib/server/db/schema';
import type { SettingsFormInput } from '$lib/schemas/settings';

const DEFAULT_ID = 'default';

export async function getSiteSettings() {
	const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, DEFAULT_ID)).limit(1);
	if (row) return row;

	await db.insert(siteSettings).values({ id: DEFAULT_ID }).onConflictDoNothing();
	const [created] = await db.select().from(siteSettings).where(eq(siteSettings.id, DEFAULT_ID)).limit(1);
	return created!;
}

export async function updateSiteSettings(data: SettingsFormInput) {
	const [row] = await db
		.update(siteSettings)
		.set({
			siteTitle: data.siteTitle,
			tagline: data.tagline,
			metaDescription: data.metaDescription,
			heroTitle: data.heroTitle,
			heroSubtitle: data.heroSubtitle,
			heroPrimaryCta: data.heroPrimaryCta,
			heroPrimaryUrl: data.heroPrimaryUrl,
			heroSecondaryCta: data.heroSecondaryCta,
			heroSecondaryUrl: data.heroSecondaryUrl,
			defaultPublished: data.defaultPublished,
			defaultTheme: data.defaultTheme
		})
		.where(eq(siteSettings.id, DEFAULT_ID))
		.returning();

	return row;
}
