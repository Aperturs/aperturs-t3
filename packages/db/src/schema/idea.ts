import type { z } from "zod";
import { relations } from "drizzle-orm";
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
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
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
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

export const ideaRelations = relations(idea, ({ one }) => ({
  createdBy: one(user, {
    fields: [idea.clerkUserId],
    references: [user.clerkUserId],
  }),
  organization: one(organization, {
    fields: [idea.organizationId],
    references: [organization.id],
  }),
}));

export const ideaInsertSchema = createInsertSchema(idea);
export type IdeaInsert = z.infer<typeof ideaInsertSchema>;

export const ideaSelectSchema = createInsertSchema(idea);
export type IdeaSelect = z.infer<typeof ideaSelectSchema>;
