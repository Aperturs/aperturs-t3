import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as logs from "./schema/logs";
import * as organisation from "./schema/organisation";
import * as post from "./schema/post";
import * as project from "./schema/project";
import * as subscriptions from "./schema/subscription";
import * as tokens from "./schema/tokens";
import * as user from "./schema/user";

export * from "drizzle-orm";
export * from "./utils";

export { organisation, post, project, tokens, user };

export const schema = {
  ...user,
  ...organisation,
  ...post,
  ...tokens,
  ...project,
  ...logs,
  ...subscriptions,
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  process.exit();
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema, logger: true });
