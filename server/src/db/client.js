import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.NODE_ENV === "production" ? 20 : 5,
  idleTimeoutMillis: process.env.NODE_ENV === "production" ? 30000 : 10000,
  connectionTimeoutMillis: 5000,
  // SSL for production (Neon requires SSL)
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Connection error handling
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export const db = drizzle(pool);

export const getConnection = async () => {
  return pool.connect();
};

// Graceful shutdown
export const closePool = async () => {
  await pool.end();
  console.log("Database pool closed");
};
