import { relations } from 'drizzle-orm';
import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
	uuid,
	uniqueIndex,
	jsonb,
	type AnyPgColumn
} from 'drizzle-orm/pg-core';
import type { FooterSocialLink } from '$lib/types/footer';
import type { NavLink } from '$lib/types/nav';
import type { LandingFeature } from '$lib/types/landing';

/** CMS tables only — used by drizzle-kit push against DATABASE_URL (not portal auth DB). */

export const category = pgTable('category', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	sortOrder: integer('sort_order').notNull().default(0)
});

export const document = pgTable(
	'document',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: text('slug').notNull(),
		title: text('title').notNull(),
		content: text('content').notNull().default(''),
		contentType: text('content_type').notNull().default('markdown'),
		mediaUrl: text('media_url'),
		excerpt: text('excerpt'),
		published: boolean('published').notNull().default(false),
		categoryId: uuid('category_id')
			.notNull()
			.references(() => category.id),
		parentDocumentId: uuid('parent_document_id').references((): AnyPgColumn => document.id, {
			onDelete: 'cascade'
		}),
		sortOrder: integer('sort_order').notNull().default(0),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull()
	},
	(table) => [uniqueIndex('document_slug_idx').on(table.slug)]
);

export const tag = pgTable('tag', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique()
});

export const documentTag = pgTable(
	'document_tag',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		documentId: uuid('document_id')
			.notNull()
			.references(() => document.id, { onDelete: 'cascade' }),
		tagId: uuid('tag_id')
			.notNull()
			.references(() => tag.id, { onDelete: 'cascade' })
	},
	(table) => [
		uniqueIndex('document_tag_document_id_tag_id_idx').on(table.documentId, table.tagId)
	]
);

export const siteSettings = pgTable('site_settings', {
	id: text('id').primaryKey().default('default'),
	siteTitle: text('site_title').notNull().default('zarnihlawn docs'),
	tagline: text('tagline').notNull().default('Software documentation'),
	metaDescription: text('meta_description')
		.notNull()
		.default('Guides, API reference, and examples for personal software projects.'),
	heroTitle: text('hero_title').notNull().default('Build faster with clear, practical docs'),
	heroSubtitle: text('hero_subtitle')
		.notNull()
		.default(
			'Guides, API reference, and examples for personal software projects — structured like the dev tools you already know and love.'
		),
	heroPrimaryCta: text('hero_primary_cta').notNull().default('Browse documentation'),
	heroPrimaryUrl: text('hero_primary_url').notNull().default('/docs'),
	heroSecondaryCta: text('hero_secondary_cta').notNull().default('Admin sign in'),
	heroSecondaryUrl: text('hero_secondary_url').notNull().default('/admin'),
	heroSearchPlaceholder: text('hero_search_placeholder'),
	techStackHeading: text('tech_stack_heading'),
	techStackItems: jsonb('tech_stack_items').$type<string[]>(),
	featuresHeading: text('features_heading'),
	featuresSubtitle: text('features_subtitle'),
	featuresItems: jsonb('features_items').$type<LandingFeature[]>(),
	codePreviewHeading: text('code_preview_heading'),
	codePreviewSubtitle: text('code_preview_subtitle'),
	codePreviewTerminalLabel: text('code_preview_terminal_label'),
	codePreviewLines: jsonb('code_preview_lines').$type<string[]>(),
	welcomeVideoUrl: text('welcome_video_url'),
	docsCategoriesHeading: text('docs_categories_heading'),
	docsCategoriesSubtitle: text('docs_categories_subtitle'),
	docsCategoriesCtaLabel: text('docs_categories_cta_label'),
	docsCategoriesCtaUrl: text('docs_categories_cta_url'),
	docsCategoryDescriptions: jsonb('docs_category_descriptions').$type<Record<string, string>>(),
	landingCtaHeading: text('landing_cta_heading'),
	landingCtaSubtitle: text('landing_cta_subtitle'),
	landingCtaPrimaryLabel: text('landing_cta_primary_label'),
	landingCtaPrimaryUrl: text('landing_cta_primary_url'),
	landingCtaSecondaryLabel: text('landing_cta_secondary_label'),
	landingCtaSecondaryUrl: text('landing_cta_secondary_url'),
	defaultPublished: boolean('default_published').notNull().default(false),
	defaultTheme: text('default_theme').notNull().default('system'),
	siteIconMime: text('site_icon_mime'),
	siteIconData: text('site_icon_data'),
	copyrightNotice: text('copyright_notice').notNull().default('zarnihlawn.com'),
	footerSocialEnabled: boolean('footer_social_enabled').notNull().default(false),
	footerSocialLinks: jsonb('footer_social_links').$type<FooterSocialLink[]>(),
	navLinksEnabled: boolean('nav_links_enabled').notNull().default(false),
	navLinks: jsonb('nav_links').$type<NavLink[]>(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull()
});

/** Legacy table — kept for existing DBs; portal roles replaced invite flow. */
export const adminInvitation = pgTable(
	'admin_invitation',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		email: text('email').notNull(),
		token: text('token').notNull(),
		invitedByUserId: text('invited_by_user_id').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		acceptedAt: timestamp('accepted_at'),
		revokedAt: timestamp('revoked_at'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [uniqueIndex('admin_invitation_token_idx').on(table.token)]
);

export const categoryRelations = relations(category, ({ many }) => ({
	documents: many(document)
}));

export const documentRelations = relations(document, ({ one, many }) => ({
	category: one(category, {
		fields: [document.categoryId],
		references: [category.id]
	}),
	parent: one(document, {
		fields: [document.parentDocumentId],
		references: [document.id],
		relationName: 'documentChildren'
	}),
	children: many(document, { relationName: 'documentChildren' }),
	documentTags: many(documentTag)
}));

export const tagRelations = relations(tag, ({ many }) => ({
	documentTags: many(documentTag)
}));

export const documentTagRelations = relations(documentTag, ({ one }) => ({
	document: one(document, {
		fields: [documentTag.documentId],
		references: [document.id]
	}),
	tag: one(tag, {
		fields: [documentTag.tagId],
		references: [tag.id]
	})
}));
