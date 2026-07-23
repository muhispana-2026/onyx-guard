import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT * FROM config', (err, res) => {
  console.log(res.rows);
  pool.end();
});
