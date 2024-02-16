-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `GithubToken` (
	`id` varchar(191) NOT NULL,
	`access_token` varchar(191) NOT NULL,
	`refresh_token` varchar(191),
	`organizationId` varchar(191),
	`clerkUserId` varchar(191),
	`profileId` varchar(191),
	`expires_in` datetime(3),
	`refresh_token_expires_in` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`organizationLsSubscriptionId` varchar(191),
	CONSTRAINT `GithubToken_id` PRIMARY KEY(`id`),
	CONSTRAINT `GithubToken_access_token_key` UNIQUE(`access_token`),
	CONSTRAINT `GithubToken_refresh_token_key` UNIQUE(`refresh_token`)
);
--> statement-breakpoint
CREATE TABLE `Idea` (
	`id` varchar(191) NOT NULL,
	`content` varchar(191) NOT NULL,
	`clerkUserId` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`organizationId` varchar(191),
	CONSTRAINT `Idea_id` PRIMARY KEY(`id`),
	CONSTRAINT `Idea_clerkUserId_key` UNIQUE(`clerkUserId`)
);
--> statement-breakpoint
CREATE TABLE `LinkedInToken` (
	`id` varchar(191) NOT NULL,
	`profileId` varchar(191),
	`access_token` text NOT NULL,
	`refresh_token` text,
	`organizationId` varchar(191),
	`clerkUserId` varchar(191),
	`expires_in` datetime(3),
	`refresh_token_expires_in` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `LinkedInToken_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Organization` (
	`id` varchar(191) NOT NULL,
	`clerkUserId` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`logo` varchar(191),
	`category` varchar(191) NOT NULL DEFAULT 'personal',
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `Organization_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `OrganizationInvites` (
	`id` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`organizationId` varchar(191) NOT NULL,
	`role` enum('OWNER','ADMIN','EDITOR','MEMBER') NOT NULL,
	`status` enum('PENDING','ACCEPTED','REJECTED','CANCELLED') NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`inviterClerkId` varchar(191) NOT NULL,
	`inviterName` varchar(191) NOT NULL,
	CONSTRAINT `OrganizationInvites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `OrganizationUser` (
	`id` varchar(191) NOT NULL,
	`organizationId` varchar(191) NOT NULL,
	`clerkUserId` varchar(191) NOT NULL,
	`role` enum('OWNER','ADMIN','EDITOR','MEMBER') NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `OrganizationUser_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Post` (
	`id` varchar(191) NOT NULL,
	`clerkUserId` varchar(191),
	`status` enum('SAVED','PUBLISHED','SCHEDULED') NOT NULL,
	`scheduledAt` datetime(3),
	`organizationId` varchar(191),
	`content` json NOT NULL,
	`projectId` varchar(191),
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `Post_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Project` (
	`id` varchar(191) NOT NULL,
	`clerkUserId` varchar(191),
	`organizationId` varchar(191) DEFAULT '',
	`projectName` varchar(191),
	`repoName` varchar(191) NOT NULL,
	`repoDescription` varchar(191) NOT NULL DEFAULT '',
	`repoUrl` varchar(191) NOT NULL,
	`repoId` varchar(191) NOT NULL,
	`questionsAnswersJsonString` json NOT NULL,
	`commitCount` int NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `Project_id` PRIMARY KEY(`id`),
	CONSTRAINT `Project_repoUrl_key` UNIQUE(`repoUrl`)
);
--> statement-breakpoint
CREATE TABLE `TwitterToken` (
	`id` varchar(191) NOT NULL,
	`organizationId` varchar(191),
	`clerkUserId` varchar(191),
	`client_id` varchar(191) NOT NULL,
	`client_secret` varchar(191) NOT NULL,
	`access_token` varchar(191),
	`refresh_token` varchar(191),
	`expires_in` datetime(3),
	`profileId` varchar(191),
	`username` varchar(191),
	`fullname` varchar(191),
	`profile_image` varchar(191),
	CONSTRAINT `TwitterToken_id` PRIMARY KEY(`id`),
	CONSTRAINT `TwitterToken_access_token_key` UNIQUE(`access_token`),
	CONSTRAINT `TwitterToken_refresh_token_key` UNIQUE(`refresh_token`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`clerkUserId` varchar(191) NOT NULL,
	`userDetails` json,
	`currentPlan` enum('FREE','PRO','PRO2','PRO3') NOT NULL DEFAULT 'FREE',
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	`ls_subscription_id` varchar(191),
	`ls_customer_id` varchar(191),
	`lsVariantId` int,
	`ls_current_period_end` datetime(3),
	CONSTRAINT `User_clerkUserId_key` UNIQUE(`clerkUserId`),
	CONSTRAINT `User_ls_customer_id_key` UNIQUE(`ls_customer_id`),
	CONSTRAINT `User_ls_subscription_id_key` UNIQUE(`ls_subscription_id`)
);
--> statement-breakpoint
CREATE TABLE `UserUsage` (
	`clerkUserId` varchar(191) NOT NULL,
	`scheduledposts` int NOT NULL DEFAULT 15,
	`scheduledtime` int NOT NULL DEFAULT 10,
	`projects` int NOT NULL DEFAULT 3,
	`socialaccounts` int NOT NULL DEFAULT 4,
	`generatedposts` int NOT NULL DEFAULT 50,
	`drafts` int NOT NULL DEFAULT 15,
	`ideas` int NOT NULL DEFAULT 15,
	`organisation` int NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updatedAt` datetime(3) NOT NULL,
	CONSTRAINT `UserUsage_clerkUserId_key` UNIQUE(`clerkUserId`)
);
--> statement-breakpoint
CREATE INDEX `GithubToken_clerkUserId_idx` ON `GithubToken` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `GithubToken_id_idx` ON `GithubToken` (`id`);--> statement-breakpoint
CREATE INDEX `GithubToken_organizationId_idx` ON `GithubToken` (`organizationId`);--> statement-breakpoint
CREATE INDEX `Idea_clerkUserId_idx` ON `Idea` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `Idea_organizationId_idx` ON `Idea` (`organizationId`);--> statement-breakpoint
CREATE INDEX `LinkedInToken_clerkUserId_idx` ON `LinkedInToken` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `LinkedInToken_id_idx` ON `LinkedInToken` (`id`);--> statement-breakpoint
CREATE INDEX `LinkedInToken_organizationId_idx` ON `LinkedInToken` (`organizationId`);--> statement-breakpoint
CREATE INDEX `LinkedInToken_profileId_idx` ON `LinkedInToken` (`profileId`);--> statement-breakpoint
CREATE INDEX `Organization_clerkUserId_idx` ON `Organization` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `OrganizationInvites_organizationId_idx` ON `OrganizationInvites` (`organizationId`);--> statement-breakpoint
CREATE INDEX `OrganizationUser_clerkUserId_idx` ON `OrganizationUser` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `OrganizationUser_organizationId_idx` ON `OrganizationUser` (`organizationId`);--> statement-breakpoint
CREATE INDEX `Post_clerkUserId_idx` ON `Post` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `Post_id_idx` ON `Post` (`id`);--> statement-breakpoint
CREATE INDEX `Post_organizationId_idx` ON `Post` (`organizationId`);--> statement-breakpoint
CREATE INDEX `Post_projectId_idx` ON `Post` (`projectId`);--> statement-breakpoint
CREATE INDEX `Project_clerkUserId_idx` ON `Project` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `Project_id_idx` ON `Project` (`id`);--> statement-breakpoint
CREATE INDEX `Project_organizationId_idx` ON `Project` (`organizationId`);--> statement-breakpoint
CREATE INDEX `TwitterToken_clerkUserId_idx` ON `TwitterToken` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `TwitterToken_id_idx` ON `TwitterToken` (`id`);--> statement-breakpoint
CREATE INDEX `TwitterToken_organizationId_idx` ON `TwitterToken` (`organizationId`);--> statement-breakpoint
CREATE INDEX `TwitterToken_profileId_idx` ON `TwitterToken` (`profileId`);--> statement-breakpoint
CREATE INDEX `User_clerkUserId_idx` ON `User` (`clerkUserId`);--> statement-breakpoint
CREATE INDEX `UserUsage_clerkUserId_idx` ON `UserUsage` (`clerkUserId`);
*/