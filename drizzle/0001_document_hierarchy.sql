ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "parent_document_id" uuid;
ALTER TABLE "document" ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0 NOT NULL;
DO $$ BEGIN
	ALTER TABLE "document" ADD CONSTRAINT "document_parent_document_id_document_id_fk"
		FOREIGN KEY ("parent_document_id") REFERENCES "public"."document"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
