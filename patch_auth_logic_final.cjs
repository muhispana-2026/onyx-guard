const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const oldBlock = `      if (username) {
        const projectAccs = await db.select().from(accounts).where(and(eq(accounts.username, username), eq(accounts.projectId, projectId)));
        
        if (projectAccs.length > 0) {
          let account = projectAccs[0];
          if (account.status === 'BANNED') {
            return res.json({ success: false, action: 'EXIT', message: "This account has been permanently banned." });
          }
          if (account.status === 'TEMP_BANNED') {
            if (account.unbanTime && new Date(account.unbanTime) > new Date()) {
               return res.json({ success: false, action: 'EXIT', message: "Security violation. Please wait 5 minutes." });
            } else {
               await db.update(accounts).set({ status: 'ONLINE', unbanTime: null }).where(eq(accounts.id, account.id));
               account.status = 'ONLINE';
            }
          }
          if (account.status === "BANNED") {
            return res.json({ success: false, action: 'EXIT', message: "Banned" });
          }
          
          if (!account.hwid || account.hwid === 'Unknown' || account.hwid === '') {
            await db.update(accounts).set({ hwid, ip, lastLogin: timestamp }).where(eq(accounts.id, account.id));
          } else if (account.hwid !== hwid) {
            return res.json({ success: false, action: 'EXIT', message: "HWID mismatch" });
          } else {
            await db.update(accounts).set({ ip, lastLogin: timestamp }).where(eq(accounts.id, account.id));
          }
        } else {
          const newAccountId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          await db.insert(accounts).values({
            id: newAccountId,
            projectId,
            username,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            ip: ip as string,
            lastLogin: timestamp
          });
          return res.json({
            success: true,
            action: "CONTINUE",
            message: \`Bienvenido \${username}, tu equipo con IP \${ip} y HWID \${hwid} ha sido registrado en Onyx Guard. Disfruta del juego.\`,
            sessionToken: Math.random().toString(36).substring(2, 15)
          });
        }
      }
      res.json({
        success: true,
        action: "CONTINUE",
        message: username ? \`Bienvenido nuevamente \${username}, disfruta del juego.\` : "Authentication successful.",
        sessionToken: Math.random().toString(36).substring(2, 15)
      });`;

const newBlock = `      const authIdentifier = username || (hwid ? 'Player_' + hwid.substring(0, 6) : 'Unknown');
      if (authIdentifier) {
        const projectAccs = await db.select().from(accounts).where(and(eq(accounts.username, authIdentifier), eq(accounts.projectId, projectId)));
        
        if (projectAccs.length > 0) {
          let account = projectAccs[0];
          if (account.status === 'BANNED') {
            return res.json({ success: false, action: 'EXIT', message: "This account has been permanently banned." });
          }
          if (account.status === 'TEMP_BANNED') {
            if (account.unbanTime && new Date(account.unbanTime) > new Date()) {
               return res.json({ success: false, action: 'EXIT', message: "Security violation. Please wait 5 minutes." });
            } else {
               await db.update(accounts).set({ status: 'ONLINE', unbanTime: null }).where(eq(accounts.id, account.id));
               account.status = 'ONLINE';
            }
          }
          if (account.status === "BANNED") {
            return res.json({ success: false, action: 'EXIT', message: "Banned" });
          }
          
          if (!account.hwid || account.hwid === 'Unknown' || account.hwid === '') {
            await db.update(accounts).set({ hwid, ip, lastLogin: timestamp }).where(eq(accounts.id, account.id));
          } else if (account.hwid !== hwid) {
            return res.json({ success: false, action: 'EXIT', message: "HWID mismatch" });
          } else {
            await db.update(accounts).set({ ip, lastLogin: timestamp }).where(eq(accounts.id, account.id));
          }
        } else {
          const newAccountId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          await db.insert(accounts).values({
            id: newAccountId,
            projectId,
            username: authIdentifier,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            ip: ip as string,
            lastLogin: timestamp
          });
          return res.json({
            success: true,
            action: "CONTINUE",
            message: \`Bienvenido \${authIdentifier}, tu equipo con IP \${ip} y HWID \${hwid} ha sido registrado en Onyx Guard. Disfruta del juego.\`,
            sessionToken: Math.random().toString(36).substring(2, 15)
          });
        }
      }

      res.json({
        success: true,
        action: "CONTINUE",
        message: authIdentifier ? \`Bienvenido nuevamente \${authIdentifier}, disfruta del juego.\` : "Authentication successful.",
        sessionToken: Math.random().toString(36).substring(2, 15)
      });`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('server.ts', content);
    console.log('Patched correctly');
} else {
    console.log('Block not found');
}
