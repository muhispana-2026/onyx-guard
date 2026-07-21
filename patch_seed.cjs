const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(/CREATE TABLE /g, 'CREATE TABLE IF NOT EXISTS ');

const alterBlock = `  try {
    const { sql } = await import('drizzle-orm');
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN username text;\`);
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN hwid text;\`);
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN ip text;\`);
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN client_version text;\`);
    await db.execute(sql\`ALTER TABLE logs ADD COLUMN reason text;\`);
    console.log('Database altered successfully');
  } catch (e) {
    console.error('Failed to alter database', e);
  }`;

content = content.replace(alterBlock, `  // Columns already added`);

fs.writeFileSync('server.ts', content);
