DROP INDEX IF EXISTS "Post_id_idx";--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "LinkedInToken" ADD COLUMN "fullName" varchar(191);