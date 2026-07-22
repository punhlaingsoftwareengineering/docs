DROP INDEX IF EXISTS "document_slug_idx";
--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT IF EXISTS "category_slug_unique";
--> statement-breakpoint
ALTER TABLE "tag" DROP CONSTRAINT IF EXISTS "tag_slug_unique";
--> statement-breakpoint
ALTER TABLE "category" DROP COLUMN IF EXISTS "slug";
--> statement-breakpoint
ALTER TABLE "document" DROP COLUMN IF EXISTS "slug";
--> statement-breakpoint
ALTER TABLE "tag" DROP COLUMN IF EXISTS "slug";
--> statement-breakpoint
DO $$ BEGIN
	ALTER TABLE "tag" ADD CONSTRAINT "tag_name_unique" UNIQUE("name");
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
