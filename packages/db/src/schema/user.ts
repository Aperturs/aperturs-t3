import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable(
  "User",
  {
    clerkUserId: varchar("clerkUserId", { length: 191 }).notNull(),
    userDetails: json("userDetails"),
    currentPlan: mysqlEnum("currentPlan", ["FREE", "PRO", "PRO2", "PRO3"])
      .default("FREE")
      .notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    lsSubscriptionId: varchar("ls_subscription_id", { length: 191 }),
    lsCustomerId: varchar("ls_customer_id", { length: 191 }),
    lsVariantId: int("lsVariantId"),
    lsCurrentPeriodEnd: datetime("ls_current_period_end", {
      mode: "string",
      fsp: 3,
    }),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("User_clerkUserId_idx").on(table.clerkUserId),
      userClerkUserIdKey: unique("User_clerkUserId_key").on(table.clerkUserId),
      userLsCustomerIdKey: unique("User_ls_customer_id_key").on(
        table.lsCustomerId,
      ),
      userLsSubscriptionIdKey: unique("User_ls_subscription_id_key").on(
        table.lsSubscriptionId,
      ),
    };
  },
);

export const userUsage = mysqlTable(
  "UserUsage",
  {
    clerkUserId: varchar("clerkUserId", { length: 191 }).notNull(),
    scheduledposts: int("scheduledposts").default(15).notNull(),
    scheduledtime: int("scheduledtime").default(10).notNull(),
    projects: int("projects").default(3).notNull(),
    socialaccounts: int("socialaccounts").default(4).notNull(),
    generatedposts: int("generatedposts").default(50).notNull(),
    drafts: int("drafts").default(15).notNull(),
    ideas: int("ideas").default(15).notNull(),
    organisation: int("organisation").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("UserUsage_clerkUserId_idx").on(table.clerkUserId),
      userUsageClerkUserIdKey: unique("UserUsage_clerkUserId_key").on(
        table.clerkUserId,
      ),
    };
  },
);
