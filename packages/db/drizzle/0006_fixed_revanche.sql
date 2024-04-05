ALTER TABLE "subscription" RENAME COLUMN "lemonSqueezyId" TO "subscriptionId";--> statement-breakpoint
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_lemonSqueezyId_unique";--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_subscriptionId_unique" UNIQUE("subscriptionId");