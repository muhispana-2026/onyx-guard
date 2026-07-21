const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const targetStr = `const { sql } = require('drizzle-orm');
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN IF NOT EXISTS username text;\`);`;
const replaceStr = `const { sql } = await import('drizzle-orm');
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN username text;\`);`;

content = content.replace(targetStr, replaceStr);
content = content.replace(/IF NOT EXISTS/g, ''); // Postgres 9.6+ doesn't support IF NOT EXISTS in ADD COLUMN? Wait, it does support it since 9.6. Let's just catch the error if it already exists.

fs.writeFileSync('server.ts', content);
