import type { z } from "zod";
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { createUniqueIds } from "../utils";

export const webhookEvents = pgTable("webhookEvent", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => createUniqueIds("wbhk")),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  eventName: text("eventName").notNull(),
  processed: boolean("processed").default(false),
  body: jsonb("body").notNull(),
  processingError: text("processingError"),
});

export const webhookEventInsert = createInsertSchema(webhookEvents);
export const webhookEventSelect = createSelectSchema(webhookEvents);

export type WebhookEventInsert = z.infer<typeof webhookEventInsert>;
export type WebhookEventSelect = z.infer<typeof webhookEventSelect>;
