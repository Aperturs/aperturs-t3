import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { createUniqueIds } from "../utils";
import { organization } from "./organisation";
import { project } from "./project";
import { youtubeToken } from "./tokens";
import { user } from "./user";

export const postStatusEnum = pgEnum("postStatus", [
  "SAVED",
  "PUBLISHED",
  "SCHEDULED",
]);

export const postReviewStatusEnum = pgEnum("postReviewStatus", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const post = pgTable(
  "Post",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => createUniqueIds("pst")),
    clerkUserId: varchar("clerkUserId", { length: 256 }).references(
      () => user.clerkUserId,
      {
        onDelete: "cascade",
      },
    ),
    status: postStatusEnum("postStatus").notNull(),
    scheduledAt: timestamp("scheduledAt", { withTimezone: true }),
    reviewStatus: postReviewStatusEnum("postReviewStatus")
      .default("PENDING")
      .notNull(),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      {
        onDelete: "cascade",
      },
    ),
    content: json("content").notNull(),
    projectId: varchar("projectId", { length: 191 }).references(
      () => project.id,
      {
        onDelete: "cascade",
      },
    ),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Post_clerkUserId_idx").on(table.clerkUserId),
      organizationIdIdx: index("Post_organizationId_idx").on(
        table.organizationId,
      ),
    };
  },
);

export type PostInsert = typeof post.$inferInsert;
export type PostSelect = typeof post.$inferSelect;

export const postRelations = relations(post, ({ one }) => ({
  organization: one(organization, {
    fields: [post.organizationId],
    references: [organization.id],
  }),
  project: one(project, {
    fields: [post.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [post.clerkUserId],
    references: [user.clerkUserId],
  }),
}));

export const youtubeContent = pgTable(
  "YoutubeContent",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => createUniqueIds("ytc")),
    YoutubeTokenId: varchar("channelId", { length: 256 }).references(
      () => youtubeToken.id,
      {
        onDelete: "cascade",
      },
    ),
    clerkId: varchar("clerkId", { length: 256 }).references(
      () => user.clerkUserId,
      {
        onDelete: "cascade",
      },
    ),
    orgId: varchar("orgId", { length: 191 }).references(() => organization.id, {
      onDelete: "cascade",
    }),
    status: postStatusEnum("postStatus").notNull(),
    reviewStatus: postReviewStatusEnum("postReviewStatus").default("PENDING"),
    scheduledAt: timestamp("scheduledAt", { withTimezone: true }),
    videoTags: json("videoTags").$type<string[]>().notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
    thumbnail: varchar("thumbnail", { length: 256 }).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      youtubeTokenId: index("YoutubeContent_postId_idx").on(
        table.YoutubeTokenId,
      ),
      clerkIdIndex: index("YoutubeContent_clerkId_idx").on(table.clerkId),
      orgIdIndex: index("YoutubeContent_orgId_idx").on(table.orgId),
    };
  },
);

export const YoutubeContentInsertSchema = createInsertSchema(youtubeContent);
export type YoutubeContentInsert = z.infer<typeof YoutubeContentInsertSchema>;

export const YoutubeContentSelectSchema = createSelectSchema(youtubeContent);
export type YoutubeContentSelect = z.infer<typeof YoutubeContentSelectSchema>;

export const youtubeContentRelations = relations(youtubeContent, ({ one }) => ({
  organization: one(organization, {
    fields: [youtubeContent.orgId],
    references: [organization.id],
  }),
  user: one(user, {
    fields: [youtubeContent.clerkId],
    references: [user.clerkUserId],
  }),
  youtubeToken: one(youtubeToken, {
    fields: [youtubeContent.YoutubeTokenId],
    references: [youtubeToken.id],
  }),
}));
