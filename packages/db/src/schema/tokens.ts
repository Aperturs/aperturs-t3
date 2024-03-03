import type z from "zod";
import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { nanoid } from "nanoid";

import { createUniqueIds } from "../utils";
import { organization } from "./organisation";
import { user } from "./user";

export const githubToken = pgTable(
  "GithubToken",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    accessToken: varchar("access_token", { length: 191 }).notNull(),
    refreshToken: varchar("refresh_token", { length: 191 }),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      { onDelete: "cascade" },
    ),
    clerkUserId: varchar("clerkUserId", { length: 191 }).references(
      () => user.clerkUserId,
      { onDelete: "cascade" },
    ),
    profileId: varchar("profileId", { length: 191 }),
    expiresIn: timestamp("expires_in", { withTimezone: true }),
    refreshTokenExpiresIn: timestamp("refresh_token_expires_in", {
      withTimezone: true,
    }),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
    organizationLsSubscriptionId: varchar("organizationLsSubscriptionId", {
      length: 191,
    }),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("GithubToken_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      organizationIdIdx: index("GithubToken_organizationId_idx").on(
        table.organizationId,
      ),
      githubTokenAccessTokenKey: unique("GithubToken_access_token_key").on(
        table.accessToken,
      ),
      githubTokenRefreshTokenKey: unique("GithubToken_refresh_token_key").on(
        table.refreshToken,
      ),
      githubAccountPerOrg: unique("GithubToken_organizationId_clerkID").on(
        table.organizationId,
        table.clerkUserId,
        table.profileId,
      ),
    };
  },
);

export const githubTokenInsertSchema = createInsertSchema(githubToken);
export const githubTokenSelectSchema = createSelectSchema(githubToken);

export type githubTokenInsert = z.infer<typeof githubTokenInsertSchema>;
export type githubTokenSelect = z.infer<typeof githubTokenSelectSchema>;

export const githubTokenRelation = relations(githubToken, ({ one }) => ({
  organization: one(organization, {
    references: [organization.id],
    fields: [githubToken.organizationId],
  }),
  clerkUser: one(user, {
    references: [user.clerkUserId],
    fields: [githubToken.clerkUserId],
  }),
}));

export const linkedInToken = pgTable(
  "LinkedInToken",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => createUniqueIds("lnk")),
    profileId: varchar("profileId", { length: 191 }),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      { onDelete: "cascade" },
    ),
    clerkUserId: varchar("clerkUserId", { length: 191 }).references(
      () => user.clerkUserId,
      { onDelete: "cascade" },
    ),
    expiresIn: timestamp("expires_in", { withTimezone: true }),
    refreshTokenExpiresIn: timestamp("refresh_token_expires_in", {
      withTimezone: true,
    }),
    fullName: varchar("fullName", { length: 191 }).default(""),
    profilePicture: varchar("profilePicture", { length: 191 }).default(""),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("LinkedInToken_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      organizationIdIdx: index("LinkedInToken_organizationId_idx").on(
        table.organizationId,
      ),
      profileIdIdx: index("LinkedInToken_profileId_idx").on(table.profileId),
      linkedinAccountPerOrg: unique("LinkedInToken_organizationId_clerkID").on(
        table.organizationId,
        table.clerkUserId,
        table.profileId,
      ),
    };
  },
);

export const linkedInTokenInsertSchema = createInsertSchema(linkedInToken);
export const linkedInTokenSelectSchema = createSelectSchema(linkedInToken);

export type linkedInTokenInsert = z.infer<typeof linkedInTokenInsertSchema>;
export type linkedInTokenSelect = z.infer<typeof linkedInTokenSelectSchema>;

export const linkedinTokenRelations = relations(linkedInToken, ({ one }) => ({
  organization: one(organization, {
    references: [organization.id],
    fields: [linkedInToken.organizationId],
  }),
  clerkUser: one(user, {
    references: [user.clerkUserId],
    fields: [linkedInToken.clerkUserId],
  }),
}));

export const twitterToken = pgTable(
  "TwitterToken",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => createUniqueIds("twt")),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      { onDelete: "cascade" },
    ),
    clerkUserId: varchar("clerkUserId", { length: 191 }).references(
      () => user.clerkUserId,
      { onDelete: "cascade" },
    ),
    clientId: varchar("client_id", { length: 191 }).notNull(),
    clientSecret: varchar("client_secret", { length: 191 }).notNull(),
    accessToken: varchar("access_token", { length: 191 }).notNull(),
    refreshToken: varchar("refresh_token", { length: 191 }).notNull(),
    expiresIn: timestamp("expires_in", { withTimezone: true }).notNull(),
    profileId: varchar("profileId", { length: 191 }).notNull(),
    username: varchar("username", { length: 191 }),
    fullname: varchar("fullname", { length: 191 }).default(""),
    profileImage: varchar("profile_image", { length: 191 }).default(""),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("TwitterToken_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      organizationIdIdx: index("TwitterToken_organizationId_idx").on(
        table.organizationId,
      ),
      profileIdIdx: index("TwitterToken_profileId_idx").on(table.profileId),
      twitterAccountPerOrg: unique("TwitterToken_Unique_ProfilePerApp").on(
        table.clientId,
        table.profileId,
      ),
    };
  },
);

export const twitterTokenInsertSchema = createInsertSchema(twitterToken);
export const twitterTokenSelectSchema = createSelectSchema(twitterToken);

export type twitterTokenInsert = z.infer<typeof twitterTokenInsertSchema>;
export type twitterTokenSelect = z.infer<typeof twitterTokenSelectSchema>;

export const twitterTokenRelations = relations(twitterToken, ({ one }) => ({
  organization: one(organization, {
    references: [organization.id],
    fields: [twitterToken.organizationId],
  }),
  clerkUser: one(user, {
    references: [user.clerkUserId],
    fields: [twitterToken.clerkUserId],
  }),
}));
