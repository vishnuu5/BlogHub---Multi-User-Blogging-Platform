import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, closePool } from "./client.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  try {
    console.log("Running migrations...");
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `🗄️  Database: ${process.env.DATABASE_URL?.split("@")[1] || "unknown"}`
    );

    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../../drizzle"),
    });

    console.log("Migrations completed successfully");
    await closePool();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    await closePool();
    process.exit(1);
  }
}

runMigrations();
