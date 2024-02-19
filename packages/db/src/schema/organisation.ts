import { sql } from "drizzle-orm";
import {
  date,
  index,
  pgEnum,
  pgTable,
  varchar,
} from "drizzle-orm/pg-core";

export const organization = pgTable(
  "Organization",
  {
    id: varchar("id", { length: 256 }).notNull().primaryKey(),
    clerkUserId: varchar("clerkUserId", { length: 256 }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    logo: varchar("logo", { length: 256 }),
    category: varchar("category", { length: 256 })
      .default("personal")
      .notNull(),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("Organization_clerkUserId_idx").on(
        table.clerkUserId,
      ),
    };
  },
);

const roleEnum = pgEnum("role", ["OWNER", "ADMIN", "EDITOR", "MEMBER"]);
const statusEnum = pgEnum("status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "CANCELLED",
]);

export const organizationInvites = pgTable(
  "OrganizationInvites",
  {
    id: varchar("id", { length: 256 }).notNull().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    organizationId: varchar("organizationId", { length: 256 }).notNull(),
    role: roleEnum("role").notNull(),
    status: statusEnum("status").notNull(),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
    inviterClerkId: varchar("inviterClerkId", { length: 256 }).notNull(),
    inviterName: varchar("inviterName", { length: 256 }).notNull(),
  },
  (table) => {
    return {
      organizationIdIdx: index("OrganizationInvites_organizationId_idx").on(
        table.organizationId,
      ),
    };
  },
);

export const organizationUser = pgTable(
  "OrganizationUser",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    organizationId: varchar("organizationId", { length: 256 }).notNull(),
    clerkUserId: varchar("clerkUserId", { length: 256 }).notNull(),
    role: pgEnum("role", ["OWNER", "ADMIN", "EDITOR", "MEMBER"])(
      "role",
    ).notNull(),
    createdAt: date("createdAt", { mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: date("updatedAt", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      clerkUserIdIdx: index("OrganizationUser_clerkUserId_idx").on(
        table.clerkUserId,
      ),
      organizationIdIdx: index("OrganizationUser_organizationId_idx").on(
        table.organizationId,
      ),
    };
  },
);
