ALTER TABLE "TwitterToken" DROP CONSTRAINT "TwitterToken_organizationId_clerkID";--> statement-breakpoint
ALTER TABLE "TwitterToken" ADD CONSTRAINT "TwitterToken_Unique_ProfilePerApp" UNIQUE("client_id","profileId");