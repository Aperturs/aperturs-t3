ALTER TABLE "Project" DROP CONSTRAINT "Project_repoUrl_key";--> statement-breakpoint
DROP INDEX IF EXISTS "Project_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "TwitterToken_id_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "User_clerkUserId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "UserUsage_clerkUserId_idx";--> statement-breakpoint
ALTER TABLE "Project" DROP CONSTRAINT "Project_id";--> statement-breakpoint
ALTER TABLE "GithubToken" DROP CONSTRAINT "GithubToken_id";--> statement-breakpoint
ALTER TABLE "LinkedInToken" DROP CONSTRAINT "LinkedInToken_id";--> statement-breakpoint
ALTER TABLE "TwitterToken" DROP CONSTRAINT "TwitterToken_id";