import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.ts';

export const createPool = () => {
  if (process.env.DATABASE_URL) {
    return mysql.createPool(process.env.DATABASE_URL);
  }
  return mysql.createPool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0
  });
};

const pool = createPool();

export const db = drizzle(pool, { schema, mode: 'default' });
