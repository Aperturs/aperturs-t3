import type { z } from "zod";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { createUniqueIds } from "../utils";
import { user } from "./user";

export const subscriptions = pgTable("subscription", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => createUniqueIds("sub")),
  subscriptionId: text("subscriptionId").unique().notNull(),
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
    .references(() => user.clerkUserId, { onDelete: "cascade" }),
  planId: integer("planId").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
  })
    .notNull()
    .$onUpdateFn(() => new Date())
    .defaultNow(),
});

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, {
    fields: [subscriptions.userId],
    references: [user.clerkUserId],
  }),
}));

export const SubscriptionInsertSchema = createInsertSchema(subscriptions);
export const SubscriptionSelectSchema = createSelectSchema(subscriptions);

export type SubscriptionInsert = z.infer<typeof SubscriptionInsertSchema>;
export type SubscriptionSelect = z.infer<typeof SubscriptionSelectSchema>;
