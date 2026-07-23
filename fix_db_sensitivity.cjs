import 'dotenv/config';
import { db } from './src/db/index.ts';
import { config } from './src/db/schema.ts';
import { isNull } from 'drizzle-orm';

async function updateDb() {
  await db.update(config).set({ speedhackSensitivity: '1.80' }).where(isNull(config.speedhackSensitivity));
  process.exit(0);
}
updateDb();
