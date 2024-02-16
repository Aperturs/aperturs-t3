import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  text,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const githubToken = mysqlTable(
  "GithubToken",
  {
    id: varchar("id", { length: 191 }).notNull(),
    accessToken: varchar("access_token", { length: 191 }).notNull(),
    refreshToken: varchar("refresh_token", { length: 191 }),
    organizationId: varchar("organizationId", { length: 191 }),
    clerkUserId: varchar("clerkUserId", { length: 191 }),
    profileId: varchar("profileId", { length: 191 }),
    expiresIn: datetime("expires_in", { mode: "string", fsp: 3 }),
    refreshTokenExpiresIn: datetime("refresh_token_expires_in", {
      mode: "string",
      fsp: 3,
    }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    organizationLsSubscriptionId: varchar("organizationLsSubscriptionId", {
      length: 191,
    }),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("GithubToken_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      idIdx: index("GithubToken_id_idx").on(table.id),
      organizationIdIdx: index("GithubToken_organizationId_idx").on(
        table.organizationId,
      ),
      githubTokenId: primaryKey({
        columns: [table.id],
        name: "GithubToken_id",
      }),
      githubTokenAccessTokenKey: unique("GithubToken_access_token_key").on(
        table.accessToken,
      ),
      githubTokenRefreshTokenKey: unique("GithubToken_refresh_token_key").on(
        table.refreshToken,
      ),
    };
  },
);

export const linkedInToken = mysqlTable(
  "LinkedInToken",
  {
    id: varchar("id", { length: 191 }).notNull(),
    profileId: varchar("profileId", { length: 191 }),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    organizationId: varchar("organizationId", { length: 191 }),
    clerkUserId: varchar("clerkUserId", { length: 191 }),
    expiresIn: datetime("expires_in", { mode: "string", fsp: 3 }),
    refreshTokenExpiresIn: datetime("refresh_token_expires_in", {
      mode: "string",
      fsp: 3,
    }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("LinkedInToken_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      idIdx: index("LinkedInToken_id_idx").on(table.id),
      organizationIdIdx: index("LinkedInToken_organizationId_idx").on(
        table.organizationId,
      ),
      profileIdIdx: index("LinkedInToken_profileId_idx").on(table.profileId),
      linkedInTokenId: primaryKey({
        columns: [table.id],
        name: "LinkedInToken_id",
      }),
    };
  },
);

export const twitterToken = mysqlTable(
  "TwitterToken",
  {
    id: varchar("id", { length: 191 }).notNull(),
    organizationId: varchar("organizationId", { length: 191 }),
    clerkUserId: varchar("clerkUserId", { length: 191 }),
    clientId: varchar("client_id", { length: 191 }).notNull(),
    clientSecret: varchar("client_secret", { length: 191 }).notNull(),
    accessToken: varchar("access_token", { length: 191 }),
    refreshToken: varchar("refresh_token", { length: 191 }),
    expiresIn: datetime("expires_in", { mode: "string", fsp: 3 }),
    profileId: varchar("profileId", { length: 191 }),
    username: varchar("username", { length: 191 }),
    fullname: varchar("fullname", { length: 191 }),
    profileImage: varchar("profile_image", { length: 191 }),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("TwitterToken_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      idIdx: index("TwitterToken_id_idx").on(table.id),
      organizationIdIdx: index("TwitterToken_organizationId_idx").on(
        table.organizationId,
      ),
      profileIdIdx: index("TwitterToken_profileId_idx").on(table.profileId),
      twitterTokenId: primaryKey({
        columns: [table.id],
        name: "TwitterToken_id",
      }),
      twitterTokenAccessTokenKey: unique("TwitterToken_access_token_key").on(
        table.accessToken,
      ),
      twitterTokenRefreshTokenKey: unique("TwitterToken_refresh_token_key").on(
        table.refreshToken,
      ),
    };
  },
);
