const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query("SELECT * FROM config;", (err, res) => {
  if (err) throw err;
  console.log(res.rows);
  process.exit();
});
