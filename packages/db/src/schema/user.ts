import { relations, sql } from "drizzle-orm";
import {
  integer,
  json,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

import { organization, organizationUser } from "./organisation";
import { post } from "./post";
import { project } from "./project";
import { subscriptions } from "./subscription";
import { socialProvider } from "./tokens";

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
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
    lsCustomerId: varchar("ls_customer_id", { length: 256 }),
  },
  (table) => {
    return {
      userLsCustomerIdKey: unique().on(table.lsCustomerId),
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
  userCreatedPosts: many(post),
  userSocialAccounts: many(socialProvider),
  // userYoutubeAccounts: many(youtubeToken),
  userSubscriptions: many(subscriptions),
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
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  }).notNull(),
});

export type UserUsageInsert = typeof userUsage.$inferInsert;
export type UserUsageSelect = typeof userUsage.$inferSelect;
