const { Pool } = require('pg');
const pool = new Pool({ 
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DB_NAME
});
pool.query("SELECT * FROM config LIMIT 1;", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
  process.exit();
});
