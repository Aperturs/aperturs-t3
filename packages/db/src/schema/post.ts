import { relations, sql } from "drizzle-orm";
import {
  date,
  index,
  json,
  pgEnum,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { organization } from "./organisation";
import { project } from "./project";
import { user } from "./user";

export const postStatusEnum = pgEnum("postStatus", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
]);

export const post = pgTable(
  "Post",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid(12)),
    clerkUserId: varchar("clerkUserId", { length: 256 }).references(
      () => user.clerkUserId,
      {
        onDelete: "cascade",
      },
    ),
    status: postStatusEnum("postStatus").notNull(),
    scheduledAt: date("scheduledAt", { mode: "string" }),
    organizationId: varchar("organizationId", { length: 191 }).references(
      () => organization.id,
      {
        onDelete: "cascade",
      },
    ),
    content: json("content").notNull(),
    projectId: varchar("projectId", { length: 191 }).references(
      () => project.id,
      {
        onDelete: "cascade",
      },
    ),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      idIdx: index("Post_id_idx").on(table.id),
    };
  },
);

export const postRelations = relations(post, ({ one }) => ({
  organization: one(organization, {
    fields: [post.organizationId],
    references: [organization.id],
  }),
  project: one(project, {
    fields: [post.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [post.clerkUserId],
    references: [user.clerkUserId],
  }),
}));
