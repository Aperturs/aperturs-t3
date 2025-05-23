import type z from "zod";
import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { createUniqueIds } from "../utils";
import { organization } from "./organisation";
import { user } from "./user";

export const socialType = pgEnum("socialType", [
  "TWITTER",
  "LINKEDIN",
  "LENS",
  "GITHUB",
  "YOUTUBE",
  "INSTAGRAM",
  "FACEBOOK",
]);

// export const githubToken = pgTable(
//   "GithubToken",
//   {
//     id: varchar("id", { length: 191 })
//       .primaryKey()
//       .$defaultFn(() => nanoid(12)),
//     accessToken: varchar("access_token", { length: 191 }).notNull(),
//     refreshToken: varchar("refresh_token", { length: 191 }),
//     organizationId: varchar("organizationId", { length: 191 }).references(
//       () => organization.id,
//       { onDelete: "cascade" },
//     ),
//     clerkUserId: varchar("clerkUserId", { length: 191 }).references(
//       () => user.clerkUserId,
//       { onDelete: "cascade" },
//     ),
//     profileId: varchar("profileId", { length: 191 }),
//     expiresIn: timestamp("expires_in", { withTimezone: true }),
//     refreshTokenExpiresIn: timestamp("refresh_token_expires_in", {
//       withTimezone: true,
//     }),
//     createdAt: timestamp("createdAt", { withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP(3)`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt", {
//       withTimezone: true,
//     }).notNull(),
//   },
//   (table) => {
//     return {
//       clerkUserIdIdx: index("GithubToken_clerkUserId_idx").on(
//         table.clerkUserId,
//       ),
//       organizationIdIdx: index("GithubToken_organizationId_idx").on(
//         table.organizationId,
//       ),
//       githubTokenAccessTokenKey: unique("GithubToken_access_token_key").on(
//         table.accessToken,
//       ),
//       githubTokenRefreshTokenKey: unique("GithubToken_refresh_token_key").on(
//         table.refreshToken,
//       ),
//       githubAccountPerOrg: unique("GithubToken_organizationId_clerkID").on(
//         table.organizationId,
//         table.clerkUserId,
//         table.profileId,
//       ),
//     };
//   },
// );

// export const githubTokenInsertSchema = createInsertSchema(githubToken);
// export const githubTokenSelectSchema = createSelectSchema(githubToken);

// export type githubTokenInsert = z.infer<typeof githubTokenInsertSchema>;
// export type githubTokenSelect = z.infer<typeof githubTokenSelectSchema>;

// export const githubTokenRelation = relations(githubToken, ({ one }) => ({
//   organization: one(organization, {
//     references: [organization.id],
//     fields: [githubToken.organizationId],
//   }),
//   clerkUser: one(user, {
//     references: [user.clerkUserId],
//     fields: [githubToken.clerkUserId],
//   }),
// }));

// export const linkedInToken = pgTable(
//   "LinkedInToken",
//   {
//     id: varchar("id", { length: 191 })
//       .primaryKey()
//       .$defaultFn(() => createUniqueIds("lnk")),
//     profileId: varchar("profileId", { length: 191 }),
//     accessToken: text("access_token").notNull(),
//     refreshToken: text("refresh_token"),
//     organizationId: varchar("organizationId", { length: 191 }).references(
//       () => organization.id,
//       { onDelete: "cascade" },
//     ),
//     clerkUserId: varchar("clerkUserId", { length: 191 }).references(
//       () => user.clerkUserId,
//       { onDelete: "cascade" },
//     ),
//     expiresIn: timestamp("expires_in", { withTimezone: true }),
//     refreshTokenExpiresIn: timestamp("refresh_token_expires_in", {
//       withTimezone: true,
//     }),
//     fullName: varchar("fullName", { length: 191 }).default(""),
//     profilePicture: varchar("profilePicture", { length: 191 }).default(""),
//     createdAt: timestamp("createdAt", { withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP(3)`)
//       .notNull(),
//     updatedAt: timestamp("updatedAt", {
//       withTimezone: true,
//     }).notNull(),
//   },
//   (table) => {
//     return {
//       clerkUserIdIdx: index("LinkedInToken_clerkUserId_idx").on(
//         table.clerkUserId,
//       ),
//       organizationIdIdx: index("LinkedInToken_organizationId_idx").on(
//         table.organizationId,
//       ),
//       profileIdIdx: index("LinkedInToken_profileId_idx").on(table.profileId),
//       linkedinAccount: unique("LinkedInToken_clerkID").on(
//         table.clerkUserId,
//         table.profileId,
//       ),
//       uniqueLinkedinAccount: unique("LinkedinIn_orgId").on(
//         table.organizationId,
//         table.profileId,
//       ),
//     };
//   },
// );

// export const linkedInTokenInsertSchema = createInsertSchema(linkedInToken);
// export const linkedInTokenSelectSchema = createSelectSchema(linkedInToken);

// export type linkedInTokenInsert = z.infer<typeof linkedInTokenInsertSchema>;
// export type linkedInTokenSelect = z.infer<typeof linkedInTokenSelectSchema>;

// export const linkedinTokenRelations = relations(linkedInToken, ({ one }) => ({
//   organization: one(organization, {
//     references: [organization.id],
//     fields: [linkedInToken.organizationId],
//   }),
//   clerkUser: one(user, {
//     references: [user.clerkUserId],
//     fields: [linkedInToken.clerkUserId],
//   }),
// }));

// export const twitterToken = pgTable(
//   "TwitterToken",
//   {
//     id: varchar("id", { length: 191 })
//       .primaryKey()
//       .$defaultFn(() => createUniqueIds("twt")),
//     organizationId: varchar("organizationId", { length: 191 }).references(
//       () => organization.id,
//       { onDelete: "cascade" },
//     ),
//     clerkUserId: varchar("clerkUserId", { length: 191 }).references(
//       () => user.clerkUserId,
//       { onDelete: "cascade" },
//     ),
//     clientId: varchar("client_id", { length: 191 }).notNull(),
//     clientSecret: varchar("client_secret", { length: 191 }).notNull(),
//     accessToken: varchar("access_token", { length: 191 }).notNull(),
//     refreshToken: varchar("refresh_token", { length: 191 }).notNull(),
//     expiresIn: timestamp("expires_in", { withTimezone: true }).notNull(),
//     profileId: varchar("profileId", { length: 191 }).notNull(),
//     username: varchar("username", { length: 191 }),
//     fullname: varchar("fullname", { length: 191 }).default(""),
//     profileImage: varchar("profile_image", { length: 191 }).default(""),
//     createdAt: timestamp("createdAt", { withTimezone: true })
//       .defaultNow()
//       .notNull(),
//     updatedAt: timestamp("updatedAt", {
//       withTimezone: true,
//     })
//       .defaultNow()
//       .notNull(),
//   },
//   (table) => {
//     return {
//       clerkUserIdIdx: index("TwitterToken_clerkUserId_idx").on(
//         table.clerkUserId,
//       ),
//       organizationIdIdx: index("TwitterToken_organizationId_idx").on(
//         table.organizationId,
//       ),
//       profileIdIdx: index("TwitterToken_profileId_idx").on(table.profileId),
//       twitterAccountPerOrg: unique("TwitterToken_Unique_ProfilePerApp").on(
//         table.clientId,
//         table.profileId,
//         table.organizationId,
//       ),
//       twitterAccountPerUser: unique("TwitterToken_Unique_ProfilePerUser").on(
//         table.clerkUserId,
//         table.profileId,
//       ),
//     };
//   },
// );

// export const twitterTokenInsertSchema = createInsertSchema(twitterToken);
// export const twitterTokenSelectSchema = createSelectSchema(twitterToken);

// export type twitterTokenInsert = z.infer<typeof twitterTokenInsertSchema>;
// export type twitterTokenSelect = z.infer<typeof twitterTokenSelectSchema>;

// export const twitterTokenRelations = relations(twitterToken, ({ one }) => ({
//   organization: one(organization, {
//     references: [organization.id],
//     fields: [twitterToken.organizationId],
//   }),
//   clerkUser: one(user, {
//     references: [user.clerkUserId],
//     fields: [twitterToken.clerkUserId],
//   }),
// }));

export const youtubeToken = pgTable(
  "YoutubeToken",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => createUniqueIds("yt")),
    channelId: varchar("channelId", { length: 191 }).notNull(),
    accessToken: text("access_token").notNull().notNull(),
    refreshToken: text("refresh_token").notNull(),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      { onDelete: "cascade" },
    ),
    clerkUserId: varchar("clerkUserId", { length: 191 }).references(
      () => user.clerkUserId,
      { onDelete: "cascade" },
    ),
    expiresIn: timestamp("expires_in", { withTimezone: true }).notNull(),
    channelName: varchar("channel_name", { length: 191 }).default("").notNull(),
    channelPicture: varchar("channelPicture", { length: 191 }).default(""),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("YoutubeToken_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      organizationIdIdx: index("YoutubeToken_organizationId_idx").on(
        table.organizationId,
      ),
      channelIdIdx: index("YoutubeToken_profileId_idx").on(table.channelId),
      linkedinAccountPerOrg: unique("YoutubeToken_organizationId_clerkID").on(
        table.organizationId,
        table.clerkUserId,
        table.channelId,
      ),
    };
  },
);

export const youtubeTokenInsertSchema = createInsertSchema(youtubeToken);
export const youtubeTokenSelectSchema = createSelectSchema(youtubeToken);

export type youtubeTokenInsert = z.infer<typeof youtubeTokenInsertSchema>;
export type youtubeTokenSelect = z.infer<typeof youtubeTokenSelectSchema>;

export const youtubeTokenRelations = relations(youtubeToken, ({ one }) => ({
  organization: one(organization, {
    references: [organization.id],
    fields: [youtubeToken.organizationId],
  }),
  clerkUser: one(user, {
    references: [user.clerkUserId],
    fields: [youtubeToken.clerkUserId],
  }),
}));

export const socialProvider = pgTable(
  "socialProvider",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => createUniqueIds("social")),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      { onDelete: "cascade" },
    ),
    clerkUserId: varchar("clerkUserId", { length: 191 }).references(
      () => user.clerkUserId,
      { onDelete: "cascade" },
    ),
    clientId: varchar("client_id", { length: 191 }),
    clientSecret: varchar("client_secret", { length: 191 }),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    expiresIn: timestamp("expires_in", { withTimezone: true }).notNull(),
    refreshTokenExpiresIn: timestamp("refresh_token_expires_in", {
      withTimezone: true,
    }),
    profileId: varchar("profileId", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }),
    fullName: varchar("fullName", { length: 191 }).default(""),
    profileImage: text("profile_image").default(""),
    socialType: socialType("socialType").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Social_clerkUserId_idx").on(table.clerkUserId),
      organizationIdIdx: index("Social_organizationId_idx").on(
        table.organizationId,
      ),
      socialAccountPerOrg: unique("Social_Unique_ProfilePerApp").on(
        table.profileId,
        table.organizationId,
      ),
      socialAccountPerPerson: unique("Social_Unique_ProfilePerUser").on(
        table.clerkUserId,
        table.profileId,
      ),
    };
  },
);

export const socialProviderInsertSchema = createInsertSchema(socialProvider);
export const socialProviderSelectSchema = createSelectSchema(socialProvider);
export const socialProviderUpdateSchema = socialProviderInsertSchema.optional();

export type SocialProviderInsertType = z.infer<
  typeof socialProviderInsertSchema
>;
export type SocialProviderSelectType = z.infer<
  typeof socialProviderSelectSchema
>;

export const SocialProviderRelations = relations(socialProvider, ({ one }) => ({
  organization: one(organization, {
    references: [organization.id],
    fields: [socialProvider.organizationId],
  }),
  clerkUser: one(user, {
    references: [user.clerkUserId],
    fields: [socialProvider.clerkUserId],
  }),
}));
