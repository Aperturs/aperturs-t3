import { relations, sql } from "drizzle-orm";
import {
  timestamp,
  integer,
  json,
  pgEnum,
  pgTable,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { idea } from "./idea";
import { organization, organizationUser } from "./organisation";
import { post } from "./post";
import { project } from "./project";
import { githubToken, linkedInToken, twitterToken } from "./tokens";

export const currentPlanEnum = pgEnum("currentPlan", [
  "FREE",
  "PRO",
  "PRO2",
  "PRO3",
]);

export const user = pgTable(
  "User",
  {
    clerkUserId: varchar("clerkUserId", { length: 256 }).primaryKey(),
    userDetails: json("userDetails"),
    currentPlan: currentPlanEnum("currentPlan").default("FREE").notNull(),
    createdAt: timestamp("createdAt", { precision: 6, withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true }).notNull(),
    lsSubscriptionId: varchar("ls_subscription_id", { length: 256 }),
    lsCustomerId: varchar("ls_customer_id", { length: 256 }),
    lsVariantId: integer("lsVariantId"),
    lsCurrentPeriodEnd: timestamp("ls_current_period_end", { precision: 6, withTimezone: true }),
  },
  (table) => {
    return {
      userLsCustomerIdKey: unique().on(table.lsCustomerId),
      userLsSubscriptionIdKey: unique().on(table.lsSubscriptionId),
    };
  },
);

export type UserInsert = typeof user.$inferInsert;
export type UserSelect = typeof user.$inferSelect;

export const userRalations = relations(user, ({ one, many }) => ({
  userUsage: one(userUsage, {
    fields: [user.clerkUserId],
    references: [userUsage.clerkUserId],
  }),
  userOwnedOrganisation: many(organization),
  userJoinedOrganisation: many(organizationUser),
  userCreatedProjects: many(project),
  userCreatedIdeas: many(idea),
  userCreatedPosts: many(post),
  userTwitterAccounts: many(twitterToken),
  userLinkedinAccounts: many(linkedInToken),
  userGithubAccounts: many(githubToken),
}));

export const userUsage = pgTable("UserUsage", {
  clerkUserId: varchar("clerkUserId", { length: 256 })
    .primaryKey()
    .references(() => user.clerkUserId, { onDelete: "cascade" }),
  scheduledposts: integer("scheduledposts").default(15).notNull(),
  scheduledtime: integer("scheduledtime").default(10).notNull(),
  projects: integer("projects").default(3).notNull(),
  socialaccounts: integer("socialaccounts").default(4).notNull(),
  generatedposts: integer("generatedposts").default(50).notNull(),
  drafts: integer("drafts").default(15).notNull(),
  ideas: integer("ideas").default(15).notNull(),
  organisation: integer("organisation").default(0).notNull(),
  createdAt: timestamp("createdAt", { precision: 6, withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", { precision: 6, withTimezone: true }).notNull(),
});

export type UserUsageInsert = typeof userUsage.$inferInsert;
export type UserUsageSelect = typeof userUsage.$inferSelect;