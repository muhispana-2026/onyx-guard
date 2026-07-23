const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("UPDATE config SET speedhack_sensitivity = '1.80' WHERE speedhack_sensitivity IS NULL;", (err, res) => {
  if (err) throw err;
  console.log("Updated config");
  process.exit();
});
