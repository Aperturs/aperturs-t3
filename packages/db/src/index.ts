import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as idea from "./schema/idea";
import * as organisation from "./schema/organisation";
import * as post from "./schema/post";
import * as project from "./schema/project";
import * as tokens from "./schema/tokens";
import * as user from "./schema/user";

export * from "drizzle-orm";

export { idea, organisation, post, project, tokens, user };


export const schema = {
  ...idea,
  ...user,
  ...organisation,
  ...post,
  ...tokens,
  ...project,
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  process.exit();
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
