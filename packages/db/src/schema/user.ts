import { sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

const currentPlanEnum = pgEnum("currentPlan", ["FREE", "PRO", "PRO2", "PRO3"]);

export const user = pgTable(
  "User",
  {
    clerkUserId: varchar("clerkUserId", { length: 256 }).notNull(),
    userDetails: json("userDetails"),
    currentPlan: currentPlanEnum("currentPlan").default("FREE").notNull(),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
    lsSubscriptionId: varchar("ls_subscription_id", { length: 256 }),
    lsCustomerId: varchar("ls_customer_id", { length: 256 }),
    lsVariantId: integer("lsVariantId"),
    lsCurrentPeriodEnd: date("ls_current_period_end", { mode: "string" }),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("User_clerkUserId_idx").on(table.clerkUserId),
      userClerkUserIdKey: unique().on(table.clerkUserId),
      userLsCustomerIdKey: unique().on(table.lsCustomerId),
      userLsSubscriptionIdKey: unique().on(table.lsSubscriptionId),
    };
  },
);

export const userUsage = pgTable(
  "UserUsage",
  {
    clerkUserId: varchar("clerkUserId", { length: 256 }).notNull(),
    scheduledposts: integer("scheduledposts").default(15).notNull(),
    scheduledtime: integer("scheduledtime").default(10).notNull(),
    projects: integer("projects").default(3).notNull(),
    socialaccounts: integer("socialaccounts").default(4).notNull(),
    generatedposts: integer("generatedposts").default(50).notNull(),
    drafts: integer("drafts").default(15).notNull(),
    ideas: integer("ideas").default(15).notNull(),
    organisation: integer("organisation").default(0).notNull(),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("UserUsage_clerkUserId_idx").on(table.clerkUserId),
      userUsageClerkUserIdKey: unique().on(table.clerkUserId),
    };
  },
);
