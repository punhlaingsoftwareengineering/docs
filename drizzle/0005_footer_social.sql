ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_social_enabled" boolean DEFAULT false NOT NULL;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_social_links" jsonb;
