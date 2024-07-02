DO $$ BEGIN
 CREATE TYPE "postReviewStatus" AS ENUM('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "YoutubeContent" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"channelId" varchar(256),
	"clerkId" varchar(256),
	"orgId" varchar(191),
	"postStatus" "postStatus" NOT NULL,
	"postReviewStatus" "postReviewStatus" DEFAULT 'PENDING',
	"scheduledAt" timestamp with time zone,
	"videoTags" json NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"thumbnail" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "YoutubeToken" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"channelId" varchar(191) NOT NULL,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"organizationId" varchar(191),
	"clerkUserId" varchar(191),
	"expires_in" timestamp with time zone NOT NULL,
	"channel_name" varchar(191) DEFAULT '' NOT NULL,
	"channelPicture" varchar(191) DEFAULT '',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "YoutubeToken_organizationId_clerkID" UNIQUE("organizationId","clerkUserId","channelId")
);
--> statement-breakpoint
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_userId_User_clerkUserId_fk";
--> statement-breakpoint
ALTER TABLE "Post" ADD COLUMN "postReviewStatus" "postReviewStatus" DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "YoutubeContent_postId_idx" ON "YoutubeContent" ("channelId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "YoutubeContent_clerkId_idx" ON "YoutubeContent" ("clerkId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "YoutubeContent_orgId_idx" ON "YoutubeContent" ("orgId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "YoutubeToken_clerkUserId_idx" ON "YoutubeToken" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "YoutubeToken_organizationId_idx" ON "YoutubeToken" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "YoutubeToken_profileId_idx" ON "YoutubeToken" ("channelId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_User_clerkUserId_fk" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YoutubeContent" ADD CONSTRAINT "YoutubeContent_channelId_YoutubeToken_id_fk" FOREIGN KEY ("channelId") REFERENCES "YoutubeToken"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YoutubeContent" ADD CONSTRAINT "YoutubeContent_clerkId_User_clerkUserId_fk" FOREIGN KEY ("clerkId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YoutubeContent" ADD CONSTRAINT "YoutubeContent_orgId_Organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YoutubeToken" ADD CONSTRAINT "YoutubeToken_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "YoutubeToken" ADD CONSTRAINT "YoutubeToken_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_organizationId_clerkUserId_unique" UNIQUE("organizationId","clerkUserId");