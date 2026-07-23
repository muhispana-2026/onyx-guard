import { createPool } from './src/db/index.ts';
console.log("Pool connection info:");
const pool = createPool();
console.log(pool.options.connectionString);
console.log(pool.options.host);
