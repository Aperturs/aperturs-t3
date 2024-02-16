import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlTable,
  primaryKey,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const idea = mysqlTable(
  "Idea",
  {
    id: varchar("id", { length: 191 }).notNull(),
    content: varchar("content", { length: 191 }).notNull(),
    clerkUserId: varchar("clerkUserId", { length: 191 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    organizationId: varchar("organizationId", { length: 191 }),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Idea_clerkUserId_idx").on(table.clerkUserId),
      organizationIdIdx: index("Idea_organizationId_idx").on(
        table.organizationId,
      ),
      ideaId: primaryKey({ columns: [table.id], name: "Idea_id" }),
      ideaClerkUserIdKey: unique("Idea_clerkUserId_key").on(table.clerkUserId),
    };
  },
);
