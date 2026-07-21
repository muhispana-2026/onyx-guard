const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const oldBlock = `      if (username) {
        const projectAccs = await db.select().from(accounts).where(and(eq(accounts.username, username), eq(accounts.projectId, projectId)));
        
        if (projectAccs.length > 0) {`;

const newBlock = `      const authIdentifier = username || (hwid ? 'Player_' + hwid.substring(0, 6) : 'Unknown');
      if (authIdentifier) {
        const projectAccs = await db.select().from(accounts).where(and(eq(accounts.username, authIdentifier), eq(accounts.projectId, projectId)));
        
        if (projectAccs.length > 0) {`;

content = content.replace(oldBlock, newBlock);

const oldInsert = `            username,`;
const newInsert = `            username: authIdentifier,`;
// wait, we have to be careful with replace, it might replace the wrong one.
