const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `async function startServer() {`;
const replaceStr = `async function startServer() {
  try {
    const { sql } = require('drizzle-orm');
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN IF NOT EXISTS username text;\`);
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN IF NOT EXISTS hwid text;\`);
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN IF NOT EXISTS ip text;\`);
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN IF NOT EXISTS client_version text;\`);
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN IF NOT EXISTS reason text;\`);
    console.log('Database altered successfully');
  } catch (e) {
    console.log('Failed to alter database, maybe columns exist');
  }
`;

content = content.replace(targetStr, replaceStr);

fs.writeFileSync('server.ts', content);
