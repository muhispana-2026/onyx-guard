import { db } from './src/db/index.ts';
import { config } from './src/db/schema.ts';
const conf = await db.select().from(config);
console.log("Cloud SQL config:", conf);
