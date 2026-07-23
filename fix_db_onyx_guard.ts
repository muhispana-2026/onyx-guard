import 'dotenv/config';
import { db } from './src/db/index.ts';
import { config } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';

async function updateDb() {
  await db.update(config).set({ serverUrl: 'https://onyx-guard.onrender.com/api/auth' });
  console.log("Updated config to point to https://onyx-guard.onrender.com/api/auth");
  process.exit(0);
}
updateDb();
