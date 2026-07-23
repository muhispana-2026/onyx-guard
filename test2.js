import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT * FROM config', (err, res) => {
  console.log(res.rows[0].security_token);
  console.log("Input:", "MU_SEC_WUHFTJR3-E3HBG8Z5");
  console.log("Match:", res.rows[0].security_token === "MU_SEC_WUHFTJR3-E3HBG8Z5");
  pool.end();
});
