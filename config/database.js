import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const db = new Pool({
  allowExitOnIdle: true, 
  connectionString,
});

try {
  await db.query("SELECT NOW()");
  console.info("DATABASE Connected");
} catch (error) {
  console.error(error);
}
