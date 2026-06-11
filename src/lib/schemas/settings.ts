import { z } from 'zod';

export const settingsFormSchema = z.object({
	siteTitle: z.string().min(1).max(100),
	tagline: z.string().max(200),
	metaDescription: z.string().max(300),
	heroTitle: z.string().min(1).max(200),
	heroSubtitle: z.string().max(500),
	heroPrimaryCta: z.string().min(1).max(50),
	heroPrimaryUrl: z.string().min(1).max(200),
	heroSecondaryCta: z.string().min(1).max(50),
	heroSecondaryUrl: z.string().min(1).max(200),
	defaultPublished: z
		.union([z.literal('true'), z.literal('false'), z.boolean()])
		.transform((v) => v === true || v === 'true'),
	defaultTheme: z.enum(['winter', 'night', 'system'])
});

export type SettingsFormInput = z.infer<typeof settingsFormSchema>;
