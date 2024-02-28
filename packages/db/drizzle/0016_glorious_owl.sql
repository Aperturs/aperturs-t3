ALTER TABLE "TwitterToken" DROP CONSTRAINT "TwitterToken_access_token_key";--> statement-breakpoint
ALTER TABLE "TwitterToken" DROP CONSTRAINT "TwitterToken_refresh_token_key";--> statement-breakpoint
ALTER TABLE "TwitterToken" DROP CONSTRAINT "TwitterToken_organizationId_clerkID";--> statement-breakpoint
ALTER TABLE "TwitterToken" ADD CONSTRAINT "TwitterToken_organizationId_clerkID" UNIQUE("client_id","profileId");