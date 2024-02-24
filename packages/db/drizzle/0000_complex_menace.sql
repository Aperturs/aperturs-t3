CREATE TABLE IF NOT EXISTS "Idea" (
	"id" varchar(191) NOT NULL,
	"content" varchar(191) NOT NULL,
	"clerkUserId" varchar(191),
	"organizationId" varchar(191),
	"createdAt" date DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updatedAt" date NOT NULL,
	CONSTRAINT "Idea_id" PRIMARY KEY("id"),
	CONSTRAINT "Idea_clerkUserId_key" UNIQUE("clerkUserId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Organization" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"clerkUserId" varchar(256),
	"name" varchar(256) NOT NULL,
	"logo" varchar(256),
	"category" varchar(256) DEFAULT 'personal' NOT NULL,
	"createdAt" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" date NOT NULL
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
	"createdAt" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OrganizationUser" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"organizationId" varchar(256) NOT NULL,
	"clerkUserId" varchar(256) NOT NULL,
	"role" "role" NOT NULL,
	"createdAt" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Post" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"clerkUserId" varchar(256),
	"postStatus" "postStatus" NOT NULL,
	"scheduledAt" date,
	"organizationId" varchar(191),
	"content" json NOT NULL,
	"projectId" varchar(191),
	"createdAt" date DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updatedAt" date NOT NULL,
	CONSTRAINT "Post_id" PRIMARY KEY("id")
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
	"createdAt" date DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updatedAt" date DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	CONSTRAINT "Project_id" PRIMARY KEY("id"),
	CONSTRAINT "Project_repoUrl_key" UNIQUE("repoUrl")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "GithubToken" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"access_token" varchar(191) NOT NULL,
	"refresh_token" varchar(191),
	"organizationId" varchar(191),
	"clerkUserId" varchar(191),
	"profileId" varchar(191),
	"expires_in" date,
	"refresh_token_expires_in" date,
	"createdAt" date DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updatedAt" date NOT NULL,
	"organizationLsSubscriptionId" varchar(191),
	CONSTRAINT "GithubToken_id" PRIMARY KEY("id"),
	CONSTRAINT "GithubToken_access_token_key" UNIQUE("access_token"),
	CONSTRAINT "GithubToken_refresh_token_key" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "LinkedInToken" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"profileId" varchar(191),
	"access_token" text NOT NULL,
	"refresh_token" text,
	"organizationId" varchar(191),
	"clerkUserId" varchar(191),
	"expires_in" date,
	"refresh_token_expires_in" date,
	"createdAt" date DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updatedAt" date NOT NULL,
	CONSTRAINT "LinkedInToken_id" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TwitterToken" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"organizationId" varchar(191),
	"clerkUserId" varchar(191),
	"client_id" varchar(191) NOT NULL,
	"client_secret" varchar(191) NOT NULL,
	"access_token" varchar(191),
	"refresh_token" varchar(191),
	"expires_in" date,
	"profileId" varchar(191),
	"username" varchar(191),
	"fullname" varchar(191),
	"profile_image" varchar(191),
	CONSTRAINT "TwitterToken_id" PRIMARY KEY("id"),
	CONSTRAINT "TwitterToken_access_token_key" UNIQUE("access_token"),
	CONSTRAINT "TwitterToken_refresh_token_key" UNIQUE("refresh_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"clerkUserId" varchar(256) PRIMARY KEY NOT NULL,
	"userDetails" json,
	"currentPlan" "currentPlan" DEFAULT 'FREE' NOT NULL,
	"createdAt" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" date NOT NULL,
	"ls_subscription_id" varchar(256),
	"ls_customer_id" varchar(256),
	"lsVariantId" integer,
	"ls_current_period_end" date,
	CONSTRAINT "User_ls_customer_id_unique" UNIQUE("ls_customer_id"),
	CONSTRAINT "User_ls_subscription_id_unique" UNIQUE("ls_subscription_id")
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
	"createdAt" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" date NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Idea_clerkUserId_idx" ON "Idea" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Idea_organizationId_idx" ON "Idea" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Organization_clerkUserId_idx" ON "Organization" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "OrganizationInvites_organizationId_idx" ON "OrganizationInvites" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "OrganizationUser_clerkUserId_idx" ON "OrganizationUser" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "OrganizationUser_organizationId_idx" ON "OrganizationUser" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Post_clerkUserId_idx" ON "Post" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Post_id_idx" ON "Post" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Post_organizationId_idx" ON "Post" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Post_projectId_idx" ON "Post" ("projectId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Project_clerkUserId_idx" ON "Project" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Project_id_idx" ON "Project" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "Project_organizationId_idx" ON "Project" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "GithubToken_clerkUserId_idx" ON "GithubToken" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "GithubToken_id_idx" ON "GithubToken" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "GithubToken_organizationId_idx" ON "GithubToken" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "LinkedInToken_clerkUserId_idx" ON "LinkedInToken" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "LinkedInToken_id_idx" ON "LinkedInToken" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "LinkedInToken_organizationId_idx" ON "LinkedInToken" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "LinkedInToken_profileId_idx" ON "LinkedInToken" ("profileId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TwitterToken_clerkUserId_idx" ON "TwitterToken" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TwitterToken_id_idx" ON "TwitterToken" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TwitterToken_organizationId_idx" ON "TwitterToken" ("organizationId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "TwitterToken_profileId_idx" ON "TwitterToken" ("profileId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "User_clerkUserId_idx" ON "User" ("clerkUserId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "UserUsage_clerkUserId_idx" ON "UserUsage" ("clerkUserId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Idea" ADD CONSTRAINT "Idea_clerkUserId_User_clerkUserId_fk" FOREIGN KEY ("clerkUserId") REFERENCES "User"("clerkUserId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Idea" ADD CONSTRAINT "Idea_organizationId_Organization_id_fk" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
