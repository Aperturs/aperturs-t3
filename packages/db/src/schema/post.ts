import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

export const post = mysqlTable(
  "Post",
  {
    id: varchar("id", { length: 191 }).notNull(),
    clerkUserId: varchar("clerkUserId", { length: 191 }),
    status: mysqlEnum("status", ["SAVED", "PUBLISHED", "SCHEDULED"]).notNull(),
    scheduledAt: datetime("scheduledAt", { mode: "string", fsp: 3 }),
    organizationId: varchar("organizationId", { length: 191 }),
    content: json("content").notNull(),
    projectId: varchar("projectId", { length: 191 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Post_clerkUserId_idx").on(table.clerkUserId),
      idIdx: index("Post_id_idx").on(table.id),
      organizationIdIdx: index("Post_organizationId_idx").on(
        table.organizationId,
      ),
      projectIdIdx: index("Post_projectId_idx").on(table.projectId),
      postId: primaryKey({ columns: [table.id], name: "Post_id" }),
    };
  },
);
