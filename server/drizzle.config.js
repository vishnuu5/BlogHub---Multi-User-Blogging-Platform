import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  ssl: process.env.NODE_ENV === "production" ? true : false,
};
