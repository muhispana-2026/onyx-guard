import { db } from './src/db/index.ts';
import { config } from './src/db/schema.ts';
import { eq } from 'drizzle-orm';
const secretToken = "MU_SEC_WUHFTJR3-E3HBG8Z5";
const query = db.select().from(config).where(eq(config.securityToken, secretToken)).toSQL();
console.log(query);
