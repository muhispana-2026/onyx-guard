const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const newCode = `      const authIdentifier = username || (hwid ? 'Player_' + hwid.substring(0, 6) : 'Unknown');
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

const startStr = "if (username) {";
const startIdx = content.indexOf(startStr, content.indexOf('app.post(["/api/report", "/api/auth"]'));

if (startIdx !== -1) {
  const endStr = "} catch (e: any) {";
  const endIdx = content.indexOf(endStr, startIdx);
  if (endIdx !== -1) {
    content = content.slice(0, startIdx) + newCode + "\n    " + content.slice(endIdx);
    fs.writeFileSync('server.ts', content);
    console.log("Patched successfully!");
  }
}
