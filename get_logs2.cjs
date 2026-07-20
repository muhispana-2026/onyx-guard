const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME,
});

async function run() {
  const { rows } = await pool.query("SELECT * FROM accounts ORDER BY last_login DESC LIMIT 10");
  console.log("Accounts:", rows);
  pool.end();
}
run();
