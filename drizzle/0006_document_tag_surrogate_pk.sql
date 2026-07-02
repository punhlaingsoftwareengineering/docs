ALTER TABLE "document_tag" ADD COLUMN IF NOT EXISTS "id" uuid DEFAULT gen_random_uuid();
--> statement-breakpoint
UPDATE "document_tag" SET "id" = gen_random_uuid() WHERE "id" IS NULL;
--> statement-breakpoint
ALTER TABLE "document_tag" DROP CONSTRAINT IF EXISTS "document_tag_document_id_tag_id_pk";
--> statement-breakpoint
ALTER TABLE "document_tag" ALTER COLUMN "id" SET NOT NULL;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conrelid = 'document_tag'::regclass AND contype = 'p'
	) THEN
		ALTER TABLE "document_tag" ADD PRIMARY KEY ("id");
	END IF;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "document_tag_document_id_tag_id_idx" ON "document_tag" ("document_id", "tag_id");
