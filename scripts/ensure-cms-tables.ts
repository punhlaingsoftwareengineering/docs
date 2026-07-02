import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const statements = [
	`CREATE TABLE IF NOT EXISTS "category" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"name" text NOT NULL,
		"slug" text NOT NULL,
		"sort_order" integer DEFAULT 0 NOT NULL,
		CONSTRAINT "category_slug_unique" UNIQUE("slug")
	)`,
	`CREATE TABLE IF NOT EXISTS "document" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"slug" text NOT NULL,
		"title" text NOT NULL,
		"content" text DEFAULT '' NOT NULL,
		"excerpt" text,
		"published" boolean DEFAULT false NOT NULL,
		"category_id" uuid NOT NULL,
		"created_at" timestamp DEFAULT now() NOT NULL,
		"updated_at" timestamp DEFAULT now() NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS "tag" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"name" text NOT NULL,
		"slug" text NOT NULL,
		CONSTRAINT "tag_slug_unique" UNIQUE("slug")
	)`,
	`CREATE TABLE IF NOT EXISTS "document_tag" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"document_id" uuid NOT NULL,
		"tag_id" uuid NOT NULL
	)`,
	`CREATE TABLE IF NOT EXISTS "site_settings" (
		"id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
		"site_title" text DEFAULT 'zarnihlawn docs' NOT NULL,
		"tagline" text DEFAULT 'Software documentation' NOT NULL,
		"meta_description" text DEFAULT 'Guides, API reference, and examples for personal software projects.' NOT NULL,
		"hero_title" text DEFAULT 'Build faster with clear, practical docs' NOT NULL,
		"hero_subtitle" text DEFAULT 'Guides, API reference, and examples for personal software projects — structured like the dev tools you already know and love.' NOT NULL,
		"hero_primary_cta" text DEFAULT 'Browse documentation' NOT NULL,
		"hero_primary_url" text DEFAULT '/docs' NOT NULL,
		"hero_secondary_cta" text DEFAULT 'Admin sign in' NOT NULL,
		"hero_secondary_url" text DEFAULT '/login' NOT NULL,
		"default_published" boolean DEFAULT false NOT NULL,
		"default_theme" text DEFAULT 'system' NOT NULL,
		"updated_at" timestamp DEFAULT now() NOT NULL
	)`,
	`DO $$ BEGIN
		ALTER TABLE "document" ADD CONSTRAINT "document_category_id_category_id_fk"
			FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL;
	END $$`,
	`DO $$ BEGIN
		ALTER TABLE "document_tag" ADD CONSTRAINT "document_tag_document_id_document_id_fk"
			FOREIGN KEY ("document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL;
	END $$`,
	`DO $$ BEGIN
		ALTER TABLE "document_tag" ADD CONSTRAINT "document_tag_tag_id_tag_id_fk"
			FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL;
	END $$`,
	`ALTER TABLE "document_tag" ADD COLUMN IF NOT EXISTS "id" uuid DEFAULT gen_random_uuid()`,
	`UPDATE "document_tag" SET "id" = gen_random_uuid() WHERE "id" IS NULL`,
	`ALTER TABLE "document_tag" DROP CONSTRAINT IF EXISTS "document_tag_document_id_tag_id_pk"`,
	`DO $$ BEGIN
		ALTER TABLE "document_tag" ALTER COLUMN "id" SET NOT NULL;
	EXCEPTION WHEN others THEN NULL;
	END $$`,
	`DO $$ BEGIN
		IF NOT EXISTS (
			SELECT 1 FROM pg_constraint
			WHERE conrelid = 'document_tag'::regclass AND contype = 'p'
		) THEN
			ALTER TABLE "document_tag" ADD PRIMARY KEY ("id");
		END IF;
	EXCEPTION WHEN duplicate_object THEN NULL;
	END $$`,
	`CREATE UNIQUE INDEX IF NOT EXISTS "document_tag_document_id_tag_id_idx" ON "document_tag" ("document_id", "tag_id")`,
	`CREATE UNIQUE INDEX IF NOT EXISTS "document_slug_idx" ON "document" USING btree ("slug")`,
	`ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "parent_document_id" uuid`,
	`ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0 NOT NULL`,
	`DO $$ BEGIN
		ALTER TABLE "document" ADD CONSTRAINT "document_parent_document_id_document_id_fk"
			FOREIGN KEY ("parent_document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL;
	END $$`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "site_icon_mime" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "site_icon_data" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "copyright_notice" text DEFAULT 'zarnihlawn.com' NOT NULL`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "hero_search_placeholder" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "tech_stack_heading" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "tech_stack_items" jsonb`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "features_heading" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "features_subtitle" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "features_items" jsonb`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "code_preview_heading" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "code_preview_subtitle" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "code_preview_terminal_label" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "code_preview_lines" jsonb`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "welcome_video_url" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "docs_categories_heading" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "docs_categories_subtitle" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "docs_categories_cta_label" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "docs_categories_cta_url" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "docs_category_descriptions" jsonb`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "landing_cta_heading" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "landing_cta_subtitle" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "landing_cta_primary_label" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "landing_cta_primary_url" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "landing_cta_secondary_label" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "landing_cta_secondary_url" text`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_social_enabled" boolean DEFAULT false NOT NULL`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_social_links" jsonb`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "nav_links_enabled" boolean DEFAULT false NOT NULL`,
	`ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "nav_links" jsonb`,
	`CREATE TABLE IF NOT EXISTS "admin_invitation" (
		"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
		"email" text NOT NULL,
		"token" text NOT NULL,
		"invited_by_user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
		"expires_at" timestamp NOT NULL,
		"accepted_at" timestamp,
		"revoked_at" timestamp,
		"created_at" timestamp DEFAULT now() NOT NULL
	)`,
	`CREATE UNIQUE INDEX IF NOT EXISTS "admin_invitation_token_idx" ON "admin_invitation" ("token")`,
	`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" text`,
	`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banned" boolean DEFAULT false`,
	`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "ban_reason" text`,
	`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "ban_expires" timestamp`,
	`UPDATE "user" SET role = 'admin' WHERE role IS NULL`,
	`ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "content_type" text DEFAULT 'markdown' NOT NULL`,
	`ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "media_url" text`,
	`UPDATE "document" SET content_type = 'markdown' WHERE content_type IS NULL`
];

for (const statement of statements) {
	await sql.query(statement);
}

console.log('CMS tables ensured.');
