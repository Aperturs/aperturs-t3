DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('OWNER', 'ADMIN', 'EDITOR', 'MEMBER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "postStatus" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "currentPlan" AS ENUM('FREE', 'PRO', 'PRO2', 'PRO3');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
