const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace(/try {\s*const { sql } = await import\('drizzle-orm'\);\s*await db\.execute.*?catch \(e\) {\s*console\.error\('Failed to alter database', e\);\s*}/gs, '');

fs.writeFileSync('server.ts', content);
