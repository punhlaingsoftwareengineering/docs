import { z } from 'zod';

const footerSocialLinkSchema = z.object({
	label: z.string().min(1).max(50),
	url: z.string().min(1).max(500)
});

const landingFeatureSchema = z.object({
	title: z.string().min(1).max(100),
	description: z.string().max(500),
	badge: z.string().max(50),
	href: z.string().min(1).max(200)
});

function parseJsonField<T>(value: unknown, schema: z.ZodType<T>, label: string): T {
	if (typeof value !== 'string' || !value.trim()) {
		throw new Error(`${label} is required.`);
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(value);
	} catch {
		throw new Error(`${label} must be valid JSON.`);
	}

	const result = schema.safeParse(parsed);
	if (!result.success) {
		const first = result.error.flatten().formErrors[0];
		throw new Error(first ?? `${label} is invalid.`);
	}

	return result.data;
}

export const settingsFormSchema = z
	.object({
		siteTitle: z.string().min(1).max(100),
		tagline: z.string().max(200),
		copyrightNotice: z.string().min(1).max(200),
		footerSocialEnabled: z
			.union([z.literal('true'), z.literal('false'), z.boolean()])
			.transform((v) => v === true || v === 'true'),
		footerSocialLinks: z.string().max(5000),
		metaDescription: z.string().max(300),
		heroTitle: z.string().min(1).max(200),
		heroSubtitle: z.string().max(500),
		heroPrimaryCta: z.string().min(1).max(50),
		heroPrimaryUrl: z.string().min(1).max(200),
		heroSecondaryCta: z.string().min(1).max(50),
		heroSecondaryUrl: z.string().min(1).max(200),
		heroSearchPlaceholder: z.string().min(1).max(100),
		techStackHeading: z.string().min(1).max(200),
		techStackItems: z.string().min(1).max(2000),
		featuresHeading: z.string().min(1).max(200),
		featuresSubtitle: z.string().max(500),
		featuresItems: z.string().min(2).max(10000),
		codePreviewHeading: z.string().min(1).max(200),
		codePreviewSubtitle: z.string().max(500),
		codePreviewTerminalLabel: z.string().min(1).max(100),
		codePreviewLines: z.string().min(1).max(10000),
		docsCategoriesHeading: z.string().min(1).max(200),
		docsCategoriesSubtitle: z.string().max(500),
		docsCategoriesCtaLabel: z.string().min(1).max(50),
		docsCategoriesCtaUrl: z.string().min(1).max(200),
		docsCategoryDescriptions: z.string().max(10000),
		landingCtaHeading: z.string().min(1).max(200),
		landingCtaSubtitle: z.string().max(500),
		landingCtaPrimaryLabel: z.string().min(1).max(50),
		landingCtaPrimaryUrl: z.string().min(1).max(200),
		landingCtaSecondaryLabel: z.string().min(1).max(50),
		landingCtaSecondaryUrl: z.string().min(1).max(200),
		defaultPublished: z
			.union([z.literal('true'), z.literal('false'), z.boolean()])
			.transform((v) => v === true || v === 'true'),
		defaultTheme: z.enum(['winter', 'night', 'system'])
	})
	.transform((data) => {
		const featuresItems = parseJsonField(
			data.featuresItems,
			z.array(landingFeatureSchema).min(1).max(12),
			'Features'
		);

		let docsCategoryDescriptions: Record<string, string> = {};
		if (data.docsCategoryDescriptions.trim()) {
			docsCategoryDescriptions = parseJsonField(
				data.docsCategoryDescriptions,
				z.record(z.string(), z.string().max(500)),
				'Category descriptions'
			);
		}

		const techStackItems = data.techStackItems
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

		if (techStackItems.length === 0) {
			throw new Error('Tech stack items must include at least one line.');
		}

		const codePreviewLines = data.codePreviewLines.split('\n');
		if (codePreviewLines.length === 0) {
			throw new Error('Code preview content must include at least one line.');
		}

		let footerSocialLinks: z.infer<typeof footerSocialLinkSchema>[] = [];
		if (data.footerSocialLinks.trim()) {
			footerSocialLinks = parseJsonField(
				data.footerSocialLinks,
				z.array(footerSocialLinkSchema).max(12),
				'Social links'
			);
		}

		return {
			...data,
			techStackItems,
			featuresItems,
			codePreviewLines,
			docsCategoryDescriptions,
			footerSocialLinks
		};
	});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
