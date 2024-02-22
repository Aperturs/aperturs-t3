import { sql } from "drizzle-orm";
import {
  date,
  index,
  pgTable,
  primaryKey,
  text,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

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
    expiresIn: date("expires_in", { mode: "string" }),
    refreshTokenExpiresIn: date("refresh_token_expires_in", {
      mode: "string",
    }),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
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

export const linkedInToken = pgTable(
  "LinkedInToken",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
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
    expiresIn: date("expires_in", { mode: "string" }),
    refreshTokenExpiresIn: date("refresh_token_expires_in", {
      mode: "string",
    }),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
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

export const twitterToken = pgTable(
  "TwitterToken",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
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
    accessToken: varchar("access_token", { length: 191 }),
    refreshToken: varchar("refresh_token", { length: 191 }),
    expiresIn: date("expires_in", { mode: "string" }),
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
