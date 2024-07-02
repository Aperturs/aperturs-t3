DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('OWNER', 'ADMIN', 'EDITOR', 'MEMBER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "postStatus" AS ENUM('SAVED', 'PUBLISHED', 'SCHEDULED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "currentPlan" AS ENUM('FREE', 'PRO', 'PRO2', 'PRO3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhookEvent" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"eventName" text NOT NULL,
	"processed" boolean DEFAULT false,
	"body" jsonb NOT NULL,
	"processingError" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organization" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"clerkUserId" varchar(256),
	"clerkOrgId" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"logo" varchar(256),
	"category" varchar(256) DEFAULT 'personal' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OrganizationInvites" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"organizationId" varchar(256) NOT NULL,
	"role" "role" NOT NULL,
	"status" "status" NOT NULL,
	"inviterClerkId" varchar(256) NOT NULL,
	"inviterName" varchar(256) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OrganizationUser" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"organizationId" varchar(256) NOT NULL,
	"clerkUserId" varchar(256) NOT NULL,
	"role" "role" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"clerkUserId" varchar(256),
	"postStatus" "postStatus" NOT NULL,
	"scheduledAt" timestamp with time zone,
	"organizationId" varchar(191),
	"content" json NOT NULL,
	"projectId" varchar(191),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Project" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"clerkUserId" varchar(191),
	"organizationId" varchar(191),
	"projectName" varchar(191),
	"repoName" varchar(191) NOT NULL,
	"repoDescription" varchar(191) DEFAULT '' NOT NULL,
	"repoUrl" varchar(191) NOT NULL,
	"repoId" varchar(191) NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscription" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"lemonSqueezyId" text NOT NULL,
	"orderId" integer NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"status" text NOT NULL,
	"statusFormatted" text NOT NULL,
	"renewsAt" text,
	"endsAt" text,
	"trialEndsAt" text,
	"price" text NOT NULL,
	"isUsageBased" boolean DEFAULT false,
	"isPaused" boolean DEFAULT false,
	"subscriptionItemId" serial NOT NULL,
	"userId" text NOT NULL,
	"planId" integer NOT NULL,
	CONSTRAINT "subscription_lemonSqueezyId_unique" UNIQUE("lemonSqueezyId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "GithubToken" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"access_token" varchar(191) NOT NULL,
	"refresh_token" varchar(191),
	"organizationId" varchar(191),
	"clerkUserId" varchar(191),
	"profileId" varchar(191),
	"expires_in" timestamp with time zone,
	"refresh_token_expires_in" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"organizationLsSubscriptionId" varchar(191),
	CONSTRAINT "GithubToken_access_token_key" UNIQUE("access_token"),
	CONSTRAINT "GithubToken_refresh_token_key" UNIQUE("refresh_token"),
	CONSTRAINT "GithubToken_organizationId_clerkID" UNIQUE("organizationId","clerkUserId","profileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LinkedInToken" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"profileId" varchar(191),
	"access_token" text NOT NULL,
	"refresh_token" text,
	"organizationId" varchar(191),
	"clerkUserId" varchar(191),
	"expires_in" timestamp with time zone,
	"refresh_token_expires_in" timestamp with time zone,
	"fullName" varchar(191) DEFAULT '',
	"profilePicture" varchar(191) DEFAULT '',
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	CONSTRAINT "LinkedInToken_organizationId_clerkID" UNIQUE("organizationId","clerkUserId","profileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TwitterToken" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"organizationId" varchar(191),
	"clerkUserId" varchar(191),
	"client_id" varchar(191) NOT NULL,
	"client_secret" varchar(191) NOT NULL,
	"access_token" varchar(191) NOT NULL,
	"refresh_token" varchar(191) NOT NULL,
	"expires_in" timestamp with time zone NOT NULL,
	"profileId" varchar(191) NOT NULL,
	"username" varchar(191),
	"fullname" varchar(191) DEFAULT '',
	"profile_image" varchar(191) DEFAULT '',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "TwitterToken_Unique_ProfilePerApp" UNIQUE("client_id","profileId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"clerkUserId" varchar(256) PRIMARY KEY NOT NULL,
	"userDetails" json,
	"currentPlan" "currentPlan" DEFAULT 'FREE' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL,
	"ls_customer_id" varchar(256),
	CONSTRAINT "User_ls_customer_id_unique" UNIQUE("ls_customer_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserUsage" (
	"clerkUserId" varchar(256) PRIMARY KEY NOT NULL,
	"scheduledposts" integer DEFAULT 15 NOT NULL,
	"scheduledtime" integer DEFAULT 10 NOT NULL,
	"projects" integer DEFAULT 3 NOT NULL,
	"socialaccounts" integer DEFAULT 4 NOT NULL,
	"generatedposts" integer DEFAULT 50 NOT NULL,
	"drafts" integer DEFAULT 15 NOT NULL,
	"ideas" integer DEFAULT 15 NOT NULL,
	"organisation" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Organization_clerkUserId_idx" ON "Organization" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "OrganizationInvites_organizationId_idx" ON "OrganizationInvites" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "OrganizationUser_clerkUserId_idx" ON "OrganizationUser" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "OrganizationUser_organizationId_idx" ON "OrganizationUser" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Post_clerkUserId_idx" ON "Post" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Post_organizationId_idx" ON "Post" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Project_clerkUserId_idx" ON "Project" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Project_organizationId_idx" ON "Project" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "GithubToken_clerkUserId_idx" ON "GithubToken" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "GithubToken_organizationId_idx" ON "GithubToken" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "LinkedInToken_clerkUserId_idx" ON "LinkedInToken" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "LinkedInToken_organizationId_idx" ON "LinkedInToken" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "LinkedInToken_profileId_idx" ON "LinkedInToken" ("profileId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TwitterToken_clerkUserId_idx" ON "TwitterToken" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TwitterToken_organizationId_idx" ON "TwitterToken" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TwitterToken_profileId_idx" ON "TwitterToken" ("profileId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Organization" ADD CONSTRAINT "Organization_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrganizationInvites" ADD CONSTRAINT "OrganizationInvites_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrganizationInvites" ADD CONSTRAINT "OrganizationInvites_inviterClerkId_User_clerkUserId_fk" FOREIGN KEY ("inviterClerkId") REFERENCES "User"("clerkUserId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "OrganizationUser" ADD CONSTRAINT "OrganizationUser_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Post" ADD CONSTRAINT "Post_projectId_Project_id_fk" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Project" ADD CONSTRAINT "Project_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Project" ADD CONSTRAINT "Project_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_userId_User_clerkUserId_fk" FOREIGN KEY ("userId") REFERENCES "User"("clerkUserId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "GithubToken" ADD CONSTRAINT "GithubToken_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "GithubToken" ADD CONSTRAINT "GithubToken_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LinkedInToken" ADD CONSTRAINT "LinkedInToken_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "LinkedInToken" ADD CONSTRAINT "LinkedInToken_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TwitterToken" ADD CONSTRAINT "TwitterToken_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TwitterToken" ADD CONSTRAINT "TwitterToken_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserUsage" ADD CONSTRAINT "UserUsage_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
