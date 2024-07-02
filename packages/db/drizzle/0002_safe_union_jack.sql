DO $$ BEGIN
 CREATE TYPE "postType" AS ENUM('NORMAL', 'SHORT', 'LONG_VIDEO');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "YoutubeContent" DROP CONSTRAINT "YoutubeContent_clerkId_User_clerkUserId_fk";
--> statement-breakpoint
ALTER TABLE "YoutubeContent" DROP CONSTRAINT "YoutubeContent_orgId_Organization_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "YoutubeContent_clerkId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "YoutubeContent_orgId_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "YoutubeContent_postId_idx";--> statement-breakpoint
ALTER TABLE "YoutubeContent" ALTER COLUMN "channelId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Post" ADD COLUMN "postType" "postType" DEFAULT 'NORMAL' NOT NULL;--> statement-breakpoint
ALTER TABLE "YoutubeContent" ADD COLUMN "postId" varchar(191) NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "YoutubeContent_tokenId_idx" ON "YoutubeContent" ("channelId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "YoutubeContent_postId_idx" ON "YoutubeContent" ("postId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YoutubeContent" ADD CONSTRAINT "YoutubeContent_postId_Post_id_fk" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "YoutubeContent" DROP COLUMN IF EXISTS "clerkId";--> statement-breakpoint
ALTER TABLE "YoutubeContent" DROP COLUMN IF EXISTS "orgId";--> statement-breakpoint
ALTER TABLE "YoutubeContent" DROP COLUMN IF EXISTS "postStatus";--> statement-breakpoint
ALTER TABLE "YoutubeContent" DROP COLUMN IF EXISTS "postReviewStatus";--> statement-breakpoint
ALTER TABLE "YoutubeContent" DROP COLUMN IF EXISTS "scheduledAt";