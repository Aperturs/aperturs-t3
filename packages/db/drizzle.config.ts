import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*",
  driver: "mysql2",
  dbCredentials: { uri: process.env.DATABASE_URL + "" },
  verbose: true,
  strict: true,
  tablesFilter: ["t3turbo_*"],
});
