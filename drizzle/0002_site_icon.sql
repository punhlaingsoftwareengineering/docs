ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "site_icon_mime" text;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "site_icon_data" text;
