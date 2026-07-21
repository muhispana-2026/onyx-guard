const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.SQL_DATABASE_URL
});
// wait, I don't know the exact ENV var the user is using on Render. But server.ts uses:
