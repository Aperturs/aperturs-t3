import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { createUniqueIds } from "../utils";
import { user } from "./user";

export const subscriptions = pgTable("subscription", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => createUniqueIds("sub")),
  lemonSqueezyId: text("lemonSqueezyId").unique().notNull(),
  orderId: integer("orderId").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  status: text("status").notNull(),
  statusFormatted: text("statusFormatted").notNull(),
  renewsAt: text("renewsAt"),
  endsAt: text("endsAt"),
  trialEndsAt: text("trialEndsAt"),
  price: text("price").notNull(),
  isUsageBased: boolean("isUsageBased").default(false),
  isPaused: boolean("isPaused").default(false),
  subscriptionItemId: serial("subscriptionItemId"),
  userId: text("userId")
    .notNull()
    .references(() => user.clerkUserId),
  planId: integer("planId").notNull(),
});

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, {
    fields: [subscriptions.userId],
    references: [user.clerkUserId],
  }),
}));
