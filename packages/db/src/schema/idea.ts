import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { organization } from "./organisation";
import { user } from "./user";

export const idea = pgTable(
  "Idea",
  {
    id: varchar("id", { length: 191 })
      .notNull()
      .$defaultFn(() => nanoid(12)),
    content: varchar("content", { length: 191 }).notNull(),
    clerkUserId: varchar("clerkUserId", { length: 191 }).references(
      () => user.clerkUserId,
      { onDelete: "cascade" },
    ),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      { onDelete: "cascade" },
    ),
    createdAt: timestamp("createdAt", { precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      precision: 6,
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Idea_clerkUserId_idx").on(table.clerkUserId),
      organizationIdIdx: index("Idea_organizationId_idx").on(
        table.organizationId,
      ),
    };
  },
);

export type IdeaSelect = typeof idea.$inferSelect;
export type IdeaInsert = typeof idea.$inferInsert;
