import { sql } from "drizzle-orm";
import {
  datetime,
  index,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  varchar,
} from "drizzle-orm/mysql-core";

export const organization = mysqlTable(
  "Organization",
  {
    id: varchar("id", { length: 191 }).notNull(),
    clerkUserId: varchar("clerkUserId", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    logo: varchar("logo", { length: 191 }),
    category: varchar("category", { length: 191 })
      .default("personal")
      .notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Organization_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      organizationId: primaryKey({
        columns: [table.id],
        name: "Organization_id",
      }),
    };
  },
);

export const organizationInvites = mysqlTable(
  "OrganizationInvites",
  {
    id: varchar("id", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    organizationId: varchar("organizationId", { length: 191 }).notNull(),
    role: mysqlEnum("role", ["OWNER", "ADMIN", "EDITOR", "MEMBER"]).notNull(),
    status: mysqlEnum("status", [
      "PENDING",
      "ACCEPTED",
      "REJECTED",
      "CANCELLED",
    ]).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    inviterClerkId: varchar("inviterClerkId", { length: 191 }).notNull(),
    inviterName: varchar("inviterName", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: index("OrganizationInvites_organizationId_idx").on(
        table.organizationId,
      ),
      organizationInvitesId: primaryKey({
        columns: [table.id],
        name: "OrganizationInvites_id",
      }),
    };
  },
);

export const organizationUser = mysqlTable(
  "OrganizationUser",
  {
    id: varchar("id", { length: 191 }).notNull(),
    organizationId: varchar("organizationId", { length: 191 }).notNull(),
    clerkUserId: varchar("clerkUserId", { length: 191 }).notNull(),
    role: mysqlEnum("role", ["OWNER", "ADMIN", "EDITOR", "MEMBER"]).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("OrganizationUser_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      organizationIdIdx: index("OrganizationUser_organizationId_idx").on(
        table.organizationId,
      ),
      organizationUserId: primaryKey({
        columns: [table.id],
        name: "OrganizationUser_id",
      }),
    };
  },
);
