import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  process.exit();
}

const migrationsClient = postgres(connectionString, {
  max: 1,
});
const db = drizzle(migrationsClient);
await migrate(db, { migrationsFolder: "./migrations" });
