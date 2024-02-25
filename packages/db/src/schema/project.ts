import { relations, sql } from "drizzle-orm";
import { index, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { organization } from "./organisation";
import { user } from "./user";

export const project = pgTable(
  "Project",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    clerkUserId: varchar("clerkUserId", { length: 191 }).references(
      () => user.clerkUserId,
      { onDelete: "cascade" },
    ),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      { onDelete: "cascade" },
    ),
    projectName: varchar("projectName", { length: 191 }),
    repoName: varchar("repoName", { length: 191 }).notNull(),
    repoDescription: varchar("repoDescription", { length: 191 })
      .default("")
      .notNull(),
    repoUrl: varchar("repoUrl", { length: 191 }).notNull(),
    repoId: varchar("repoId", { length: 191 }).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Project_clerkUserId_idx").on(table.clerkUserId),
      organizationIdIdx: index("Project_organizationId_idx").on(
        table.organizationId,
      ),
    };
  },
);

export type ProjectInsert = typeof project.$inferInsert;
export type ProjectSelect = typeof project.$inferSelect;

export const projectRelations = relations(project, ({ one }) => ({
  organization: one(organization, {
    fields: [project.organizationId],
    references: [organization.id],
  }),
  createdBy: one(user, {
    fields: [project.clerkUserId],
    references: [user.clerkUserId],
  }),
}));
