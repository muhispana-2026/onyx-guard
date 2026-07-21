const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
async function run() {
  try {
    await pool.query('ALTER TABLE logs ADD COLUMN username text;');
    await pool.query('ALTER TABLE logs ADD COLUMN hwid text;');
    await pool.query('ALTER TABLE logs ADD COLUMN ip text;');
    await pool.query('ALTER TABLE logs ADD COLUMN client_version text;');
    await pool.query('ALTER TABLE logs ADD COLUMN reason text;');
    console.log("Columns added successfully");
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
