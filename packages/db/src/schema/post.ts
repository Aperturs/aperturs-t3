import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import type { ContentType } from "@aperturs/validators/post";

import { createUniqueIds } from "../utils";
import { organization } from "./organisation";
import { project } from "./project";
import { socialProvider, youtubeToken } from "./tokens";
import { user } from "./user";

export const postStatusEnum = pgEnum("postStatus", [
  "SAVED",
  "PUBLISHED",
  "SCHEDULED",
  "DELETED",
  "FAILED",
]);

export const postReviewStatusEnum = pgEnum("postReviewStatus", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const privacyStatusEnum = pgEnum("privacyStatus", [
  "PUBLIC",
  "PRIVATE",
  "UNLISTED",
]);

export const postType = pgEnum("postType", ["NORMAL", "SHORT", "LONG_VIDEO"]);

export const socialType = pgEnum("socialType", [
  "DEFAULT",
  "TWITTER",
  "LINKEDIN",
  "LENS",
  "GITHUB",
  "YOUTUBE",
  "INSTAGRAM",
  "FACEBOOK",
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
    postType: postType("postType").default("NORMAL").notNull(),
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
    projectId: varchar("projectId", { length: 191 }).references(
      () => project.id,
      {
        onDelete: "cascade",
      },
    ),
    isDeleted: boolean("isDeleted").default(false).notNull(),
    postFailureReason: text("postFailureReason"),
    privacyStatus: privacyStatusEnum("privacyStatus")
      .default("UNLISTED")
      .notNull(),
    content: json("content").$type<ContentType[]>().default([]).notNull(),
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

export const postRelations = relations(post, ({ one, many }) => ({
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
  alternatePostContent: many(alternatePostContent),
  postToSocialProviders: many(postToSocialProvider),
}));

export const postToSocialProvider = pgTable(
  "PostToSocialProvider",
  {
    postId: varchar("postId", { length: 191 })
      .references(() => post.id, {
        onDelete: "cascade",
      })
      .notNull(),
    socialProviderId: varchar("socialProviderId", { length: 191 })
      .references(() => socialProvider.id, {
        onDelete: "cascade",
      })
      .notNull(),
  },
  (table) => ({
    cpk: primaryKey({
      name: "PostToSocialProvider_pkey",
      columns: [table.postId, table.socialProviderId],
    }),
  }),
);

export const postToSocialProviderRelations = relations(
  postToSocialProvider,
  ({ one }) => ({
    post: one(post, {
      fields: [postToSocialProvider.postId],
      references: [post.id],
    }),
    socialProvider: one(socialProvider, {
      fields: [postToSocialProvider.socialProviderId],
      references: [socialProvider.id],
    }),
  }),
);

export const alternatePostContent = pgTable(
  "AlternatePostContent",
  {
    postId: varchar("postId", { length: 191 })
      .references(() => post.id, {
        onDelete: "cascade",
      })
      .notNull(),
    socialProviderId: varchar("socialProviderId", { length: 191 })
      .references(() => socialProvider.id, {
        onDelete: "cascade",
      })
      .notNull(),
    content: json("content").$type<ContentType[]>().default([]).notNull(),
  },
  (table) => ({
    cpk: primaryKey({
      name: "alternatePostContent_pkey",
      columns: [table.postId, table.socialProviderId],
    }),
  }),
);

export const alternatePostContentInsertSchema =
  createInsertSchema(alternatePostContent);
export type AlternatePostContentInsert = z.infer<
  typeof alternatePostContentInsertSchema
>;

export const alternatePostContentSelectSchema =
  createSelectSchema(alternatePostContent);
export type AlternatePostContentSelect = z.infer<
  typeof alternatePostContentSelectSchema
>;

export const alternatePostContentRelations = relations(
  alternatePostContent,
  ({ one }) => ({
    post: one(post, {
      fields: [alternatePostContent.postId],
      references: [post.id],
    }),
    socialProvider: one(socialProvider, {
      fields: [alternatePostContent.socialProviderId],
      references: [socialProvider.id],
    }),
  }),
);

// export const postContent = pgTable(
//   "PostContent",
//   {
//     id: varchar("id", { length: 191 })
//       .primaryKey()
//       .$defaultFn(() => createUniqueIds("sp")),
//     order: integer("order").notNull(),
//     postId: varchar("postId", { length: 191 }).references(() => post.id, {
//       onDelete: "cascade",
//     }),
//     name: varchar("name", { length: 256 }).notNull(),
//     text: text("textContent").notNull(),
//     media: json("media").$type<MediaType[]>().default([]),
//     tags: json("tags").$type<string[]>().default([]),
//     socialType: socialType("postType").default("DEFAULT").notNull(),
//     socialProviderId: varchar("socialProviderId", { length: 191 }).references(
//       () => socialProvider.id,
//       {
//         onDelete: "cascade",
//       },
//     ),
//     createdAt: timestamp("createdAt", { withTimezone: true })
//       .defaultNow()
//       .notNull(),
//     updatedAt: timestamp("updatedAt", {
//       withTimezone: true,
//     }).notNull(),
//   },
//   (table) => {
//     return {
//       alternatePostContentIdx: foreignKey({
//         columns: [table.postId, table.socialProviderId],
//         foreignColumns: [
//           alternatePostContent.postId,
//           alternatePostContent.socialProviderId,
//         ],
//       }).onDelete("cascade"),
//       postIdIdx: index("PostContent_postId_idx").on(table.postId),
//     };
//   },
// );

// export const postContentRelations = relations(postContent, ({ one }) => ({
//   post: one(post, {
//     fields: [postContent.postId],
//     references: [post.id],
//   }),
//   socialProvider: one(socialProvider, {
//     fields: [postContent.socialProviderId],
//     references: [socialProvider.id],
//   }),
//   alternatePostContent: one(alternatePostContent, {
//     fields: [postContent.postId, postContent.socialProviderId],
//     references: [
//       alternatePostContent.postId,
//       alternatePostContent.socialProviderId,
//     ],
//   }),
// }));

// export const PostContentInsertSchema = createInsertSchema(postContent);
// export type PostContentInsert = z.infer<typeof PostContentInsertSchema>;

// export const PostContentSelectSchema = createSelectSchema(postContent);
// export type PostContentSelect = z.infer<typeof PostContentSelectSchema>;

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
    postId: varchar("postId", { length: 191 })
      .references(() => post.id, {
        onDelete: "cascade",
      })
      .notNull(),
    videoTags: json("videoTags").$type<string[]>().notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }).notNull(),
    thumbnail: varchar("thumbnail", { length: 256 }).notNull(),
    video: varchar("video", { length: 256 }).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      youtubeTokenId: index("YoutubeContent_tokenId_idx").on(
        table.YoutubeTokenId,
      ),
      postIdIdx: index("YoutubeContent_postId_idx").on(table.postId),
    };
  },
);

export const YoutubeContentInsertSchema = createInsertSchema(youtubeContent);
export type YoutubeContentInsert = z.infer<typeof YoutubeContentInsertSchema>;

export const YoutubeContentSelectSchema = createSelectSchema(youtubeContent);
export type YoutubeContentSelect = z.infer<typeof YoutubeContentSelectSchema>;

export const youtubeContentRelations = relations(youtubeContent, ({ one }) => ({
  post: one(post, {
    fields: [youtubeContent.postId],
    references: [post.id],
  }),
  youtubeToken: one(youtubeToken, {
    fields: [youtubeContent.YoutubeTokenId],
    references: [youtubeToken.id],
  }),
}));
