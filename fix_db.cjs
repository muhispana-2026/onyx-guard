const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_ADMIN_USER,
  password: process.env.SQL_ADMIN_PASSWORD,
  database: process.env.SQL_DB_NAME,
});
async function run() {
  try {
    await pool.query('ALTER TABLE logs ADD COLUMN IF NOT EXISTS username text;');
    await pool.query('ALTER TABLE logs ADD COLUMN IF NOT EXISTS hwid text;');
    await pool.query('ALTER TABLE logs ADD COLUMN IF NOT EXISTS ip text;');
    await pool.query('ALTER TABLE logs ADD COLUMN IF NOT EXISTS client_version text;');
    await pool.query('ALTER TABLE logs ADD COLUMN IF NOT EXISTS reason text;');
    console.log("Columns added successfully");
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
