ALTER TABLE "LinkedInToken" ALTER COLUMN "fullName" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "LinkedInToken" ALTER COLUMN "profilePicture" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "TwitterToken" ALTER COLUMN "access_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "TwitterToken" ALTER COLUMN "refresh_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "TwitterToken" ALTER COLUMN "expires_in" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "TwitterToken" ALTER COLUMN "profileId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "TwitterToken" ALTER COLUMN "fullname" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "TwitterToken" ALTER COLUMN "profile_image" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "GithubToken" ADD CONSTRAINT "GithubToken_organizationId_clerkID" UNIQUE("organizationId","clerkUserId","profileId");--> statement-breakpoint
ALTER TABLE "LinkedInToken" ADD CONSTRAINT "LinkedInToken_organizationId_clerkID" UNIQUE("organizationId","clerkUserId","profileId");--> statement-breakpoint
ALTER TABLE "TwitterToken" ADD CONSTRAINT "TwitterToken_organizationId_clerkID" UNIQUE("organizationId","clerkUserId","profileId");