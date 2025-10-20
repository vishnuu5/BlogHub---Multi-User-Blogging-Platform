import { sql } from "drizzle-orm";
import { db, closePool } from "./client.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runSimpleMigration() {
  try {
    console.log("Running migrations...");
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(
      `🗄️  Database: ${process.env.DATABASE_URL?.split("@")[1] || "unknown"}`
    );

    // Read and execute the SQL file
    const sqlPath = path.join(
      __dirname,
      "../../drizzle/0000_wooden_snowbird.sql"
    );
    const sqlContent = fs.readFileSync(sqlPath, "utf-8");

    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    for (const statement of statements) {
      await db.execute(sql.raw(statement));
      console.log("Executed:", statement.substring(0, 50) + "...");
    }

    console.log("All migrations completed successfully");
    await closePool();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error.message);
    console.error("Stack:", error.stack);
    await closePool();
    process.exit(1);
  }
}

runSimpleMigration();
