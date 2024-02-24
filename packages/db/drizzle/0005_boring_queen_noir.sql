ALTER TABLE "Idea" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "Idea" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "Organization" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "Organization" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Organization" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "OrganizationInvites" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "OrganizationInvites" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "OrganizationUser" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "OrganizationUser" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "scheduledAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "Project" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "Project" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "GithubToken" ALTER COLUMN "expires_in" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "GithubToken" ALTER COLUMN "refresh_token_expires_in" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "GithubToken" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "GithubToken" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "LinkedInToken" ALTER COLUMN "expires_in" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "LinkedInToken" ALTER COLUMN "refresh_token_expires_in" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "LinkedInToken" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "LinkedInToken" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "TwitterToken" ALTER COLUMN "expires_in" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "ls_current_period_end" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "UserUsage" ALTER COLUMN "createdAt" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "UserUsage" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp (6) with time zone;