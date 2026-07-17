const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const targetServer = `        if (accQuery.empty) {
          await logEntry("BLOCKED", \`Account \${username} not registered in DB\`);
          return res.json({ success: false, action: config.actionOnFailure, message: "Account not registered" });
        }`;

const replacementServer = `        if (accQuery.empty) {
          // Auto-register new accounts to avoid immediate blocking
          const newAccountId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
          await setDoc(doc(db, 'accounts', newAccountId), {
            id: newAccountId,
            projectId,
            username,
            hwid: hwid || 'Unknown',
            status: 'ACTIVE',
            lastLogin: timestamp
          });
          await logEntry("ALLOWED", \`Auto-registered account \${username} with HWID \${hwid}\`);
          return res.json({
            success: true,
            action: "CONTINUE",
            message: "Authorization successful",
            sessionToken: Math.random().toString(36).substring(2, 15)
          });
        }`;

code = code.replace(targetServer, replacementServer);
fs.writeFileSync('server.ts', code);
console.log("Patched server.ts auto-register");
