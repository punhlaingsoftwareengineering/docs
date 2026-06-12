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
		"document_id" uuid NOT NULL,
		"tag_id" uuid NOT NULL,
		CONSTRAINT "document_tag_document_id_tag_id_pk" PRIMARY KEY("document_id","tag_id")
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
	`CREATE UNIQUE INDEX IF NOT EXISTS "document_slug_idx" ON "document" USING btree ("slug")`,
	`ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "parent_document_id" uuid`,
	`ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0 NOT NULL`,
	`DO $$ BEGIN
		ALTER TABLE "document" ADD CONSTRAINT "document_parent_document_id_document_id_fk"
			FOREIGN KEY ("parent_document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;
	EXCEPTION WHEN duplicate_object THEN NULL;
	END $$`
];

for (const statement of statements) {
	await sql.query(statement);
}

console.log('CMS tables ensured.');
