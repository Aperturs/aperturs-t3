ALTER TYPE "postStatus" ADD VALUE 'SAVED';--> statement-breakpoint
ALTER TYPE "postStatus" ADD VALUE 'PUBLISHED';--> statement-breakpoint
ALTER TYPE "postStatus" ADD VALUE 'SCHEDULED';--> statement-breakpoint
ALTER TABLE "Idea" ALTER COLUMN "createdAt" SET DEFAULT now();