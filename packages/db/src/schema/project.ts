import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  int,
  json,
  mysqlTable,
  primaryKey,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const project = mysqlTable(
  "Project",
  {
    id: varchar("id", { length: 191 }).notNull(),
    clerkUserId: varchar("clerkUserId", { length: 191 }),
    organizationId: varchar("organizationId", { length: 191 }).default(""),
    projectName: varchar("projectName", { length: 191 }),
    repoName: varchar("repoName", { length: 191 }).notNull(),
    repoDescription: varchar("repoDescription", { length: 191 })
      .default("")
      .notNull(),
    repoUrl: varchar("repoUrl", { length: 191 }).notNull(),
    repoId: varchar("repoId", { length: 191 }).notNull(),
    questionsAnswersJsonString: json("questionsAnswersJsonString").notNull(),
    commitCount: int("commitCount").notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 })
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
