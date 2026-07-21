const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

// We need to add logging for when a user logs in successfully or is blocked due to ban / HWID mismatch

const authCodeOld = `        if (projectAccs.length > 0) {
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
        } else {`;

const authCodeNew = `        if (projectAccs.length > 0) {
          let account = projectAccs[0];
          if (account.status === 'BANNED') {
            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: Account is permanently banned.\`, timestamp
            });
            return res.json({ success: false, action: 'EXIT', message: "This account has been permanently banned." });
          }
          if (account.status === 'TEMP_BANNED') {
            if (account.unbanTime && new Date(account.unbanTime) > new Date()) {
               await db.insert(logs).values({
                 id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                 projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: Account is temporarily banned.\`, timestamp
               });
               return res.json({ success: false, action: 'EXIT', message: "Security violation. Please wait 5 minutes." });
            } else {
               await db.update(accounts).set({ status: 'ONLINE', unbanTime: null }).where(eq(accounts.id, account.id));
               account.status = 'ONLINE';
            }
          }
          
          if (!account.hwid || account.hwid === 'Unknown' || account.hwid === '') {
            await db.update(accounts).set({ hwid, ip, lastLogin: timestamp }).where(eq(accounts.id, account.id));
          } else if (account.hwid !== hwid) {
            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: HWID mismatch (\${hwid} vs \${account.hwid}).\`, timestamp
            });
            return res.json({ success: false, action: 'EXIT', message: "HWID mismatch" });
          } else {
            await db.update(accounts).set({ ip, lastLogin: timestamp }).where(eq(accounts.id, account.id));
          }
          
          if (!reason) {
            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "INFO", message: \`AUTH SUCCESS [\${authIdentifier} - \${hwid}]\`, timestamp
            });
          }
        } else {`;

content = content.replace(authCodeOld, authCodeNew);

const newUserOld = `          await db.insert(accounts).values({
            id: newAccountId,
            projectId,
            username: authIdentifier,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            ip: ip as string,
            lastLogin: timestamp
          });
          return res.json({`;

const newUserNew = `          await db.insert(accounts).values({
            id: newAccountId,
            projectId,
            username: authIdentifier,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            ip: ip as string,
            lastLogin: timestamp
          });
          if (!reason) {
            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "INFO", message: \`NEW ACCOUNT REGISTERED [\${authIdentifier} - \${hwid}]\`, timestamp
            });
          }
          return res.json({`;

content = content.replace(newUserOld, newUserNew);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with auth logs");
