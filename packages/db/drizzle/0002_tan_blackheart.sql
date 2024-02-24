DROP INDEX IF EXISTS "Post_clerkUserId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "Post_organizationId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "Post_projectId_idx";--> statement-breakpoint
ALTER TABLE "Post" DROP CONSTRAINT "Post_id";