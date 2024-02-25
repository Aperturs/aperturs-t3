import { relations } from "drizzle-orm";
import {
  index,
  json,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

import { organization } from "./organisation";
import { project } from "./project";
import { user } from "./user";

export const postStatusEnum = pgEnum("postStatus", [
  "SAVED",
  "PUBLISHED",
  "SCHEDULED",
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
    scheduledAt: timestamp("scheduledAt", { withTimezone: true }),
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
    createdAt: timestamp("createdAt", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
    }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Post_clerkUserId_idx").on(table.clerkUserId),
      organizationIdIdx: index("Post_organizationId_idx").on(
        table.organizationId,
      ),
    };
  },
);

export type PostInsert = typeof post.$inferInsert;
export type PostSelect = typeof post.$inferSelect;

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
