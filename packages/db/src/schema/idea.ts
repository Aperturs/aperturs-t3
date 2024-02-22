import { sql } from "drizzle-orm";
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
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
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
