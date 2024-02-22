import { relations, sql } from "drizzle-orm";
import { date, index, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { idea } from "./idea";
import { post } from "./post";
import { project } from "./project";
import { githubToken, linkedInToken, twitterToken } from "./tokens";
import { user } from "./user";

export const roleEnum = pgEnum("role", ["OWNER", "ADMIN", "EDITOR", "MEMBER"]);
export const statusEnum = pgEnum("status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
]);

export const organization = pgTable(
  "Organization",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    clerkUserId: varchar("clerkUserId", { length: 256 }).references(
      () => user.clerkUserId,
      {
        onDelete: "cascade",
      },
    ),
    name: varchar("name", { length: 256 }).notNull(),
    logo: varchar("logo", { length: 256 }),
    category: varchar("category", { length: 256 })
      .default("personal")
      .notNull(),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Organization_clerkUserId_idx").on(
        table.clerkUserId,
      ),
    };
  },
);

export const organisationRelations = relations(
  organization,
  ({ many, one }) => ({
    owner: one(user, {
      fields: [organization.clerkUserId],
      references: [user.clerkUserId],
    }),
    invites: many(organizationInvites),
    members: many(organizationUser),
    orgCreatedProjects: many(project),
    orgCreatedIdeas: many(idea),
    orgCreatedPosts: many(post),
    orgTwitterAccounts: many(twitterToken),
    orgLinkedinAccounts: many(linkedInToken),
    orgGithubAccounts: many(githubToken),
  }),
);

export const organizationInvites = pgTable(
  "OrganizationInvites",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    organizationId: varchar("organizationId", { length: 256 })
      .notNull()
      .references(() => organization.id, {
        onDelete: "cascade",
      }),
    role: roleEnum("role").notNull(),
    status: statusEnum("status").notNull(),
    inviterClerkId: varchar("inviterClerkId", { length: 256 })
      .notNull()
      .references(() => user.clerkUserId),
    inviterName: varchar("inviterName", { length: 256 }).notNull(),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: index("OrganizationInvites_organizationId_idx").on(
        table.organizationId,
      ),
    };
  },
);

export const organizationInvitesRelations = relations(
  organizationInvites,
  ({ one }) => ({
    organization: one(organization, {
      fields: [organizationInvites.organizationId],
      references: [organization.id],
    }),
    invitedBy: one(user, {
      fields: [organizationInvites.inviterClerkId],
      references: [user.clerkUserId],
    }),
  }),
);

export const organizationUser = pgTable(
  "OrganizationUser",
  {
    id: varchar("id", { length: 256 })
      .primaryKey()
      .$defaultFn(() => nanoid(11)),
    organizationId: varchar("organizationId", { length: 256 }).notNull(),
    clerkUserId: varchar("clerkUserId", { length: 256 })
      .notNull()
      .references(() => user.clerkUserId, {
        onDelete: "cascade",
      }),
    role: pgEnum("role", ["OWNER", "ADMIN", "EDITOR", "MEMBER"])(
      "role",
    ).notNull(),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("OrganizationUser_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      organizationIdIdx: index("OrganizationUser_organizationId_idx").on(
        table.organizationId,
      ),
    };
  },
);

export const organizationUserRelations = relations(
  organizationUser,
  ({ one }) => ({
    organization: one(organization, {
      fields: [organizationUser.organizationId],
      references: [organization.id],
    }),
    user: one(user, {
      fields: [organizationUser.clerkUserId],
      references: [user.clerkUserId],
    }),
  }),
);
