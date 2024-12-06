import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const db = new Pool({
  allowExitOnIdle: true,
  connectionString,
    // ssl: true,
});

// Probar conexión inicial
(async () => {
  try {
    const res = await db.query("SELECT NOW()");
    console.info("📊 DATABASE Connected at:", res.rows[0].now);
  } catch (error) {
    console.error("❌ DATABASE Connection Error:", error.message);
    process.exit(1);
  }
})();
