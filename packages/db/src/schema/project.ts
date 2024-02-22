import { relations, sql } from "drizzle-orm";
import {
  date,
  index,
  pgTable,
  primaryKey,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
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
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Project_clerkUserId_idx").on(table.clerkUserId),
      idIdx: index("Project_id_idx").on(table.id),
      organizationIdIdx: index("Project_organizationId_idx").on(
        table.organizationId,
      ),
      projectId: primaryKey({ columns: [table.id], name: "Project_id" }),
      projectRepoUrlKey: unique("Project_repoUrl_key").on(table.repoUrl),
    };
  },
);

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
