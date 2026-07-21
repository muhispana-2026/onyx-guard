const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const hackOld = `        await db.insert(logs).values({
          id: logId,
          projectId,
          type: "BLOCKED",
          message: \`HACK DETECTED [\${username || 'Unknown'} - \${hwid || 'Unknown'}]: \${reason}\`,
          timestamp
        });`;
        
const hackNew = `        await db.insert(logs).values({
          id: logId,
          projectId,
          type: "BLOCKED",
          message: \`HACK DETECTED [\${username || 'Unknown'} - \${hwid || 'Unknown'}]: \${reason}\`,
          timestamp,
          username: username || 'Unknown',
          hwid: hwid || 'Unknown',
          ip: ip,
          clientVersion: req.body.clientVersion || 'Unknown',
          reason: reason
        });`;

content = content.replace(hackOld, hackNew);

const banOld = `            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: Account is permanently banned.\`, timestamp
            });`;

const banNew = `            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: Account is permanently banned.\`, timestamp,
              username: authIdentifier, hwid: hwid || 'Unknown', ip: ip, clientVersion: req.body.clientVersion || 'Unknown', reason: 'Account permanently banned'
            });`;

content = content.replace(banOld, banNew);

const tempBanOld = `               await db.insert(logs).values({
                 id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                 projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: Account is temporarily banned.\`, timestamp
               });`;

const tempBanNew = `               await db.insert(logs).values({
                 id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
                 projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: Account is temporarily banned.\`, timestamp,
                 username: authIdentifier, hwid: hwid || 'Unknown', ip: ip, clientVersion: req.body.clientVersion || 'Unknown', reason: 'Account temporarily banned'
               });`;

content = content.replace(tempBanOld, tempBanNew);

const hwidOld = `            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: HWID mismatch (\${hwid} vs \${account.hwid}).\`, timestamp
            });`;

const hwidNew = `            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "BLOCKED", message: \`AUTH BLOCKED [\${authIdentifier}]: HWID mismatch (\${hwid} vs \${account.hwid}).\`, timestamp,
              username: authIdentifier, hwid: hwid || 'Unknown', ip: ip, clientVersion: req.body.clientVersion || 'Unknown', reason: \`HWID mismatch (\${hwid} vs \${account.hwid})\`
            });`;

content = content.replace(hwidOld, hwidNew);

const infoOld = `            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "INFO", message: \`AUTH SUCCESS [\${authIdentifier} - \${hwid}]\`, timestamp
            });`;

const infoNew = `            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "INFO", message: \`AUTH SUCCESS [\${authIdentifier} - \${hwid}]\`, timestamp,
              username: authIdentifier, hwid: hwid || 'Unknown', ip: ip, clientVersion: req.body.clientVersion || 'Unknown', reason: 'Authorized'
            });`;

content = content.replace(infoOld, infoNew);

const newAccOld = `            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "INFO", message: \`NEW ACCOUNT REGISTERED [\${authIdentifier} - \${hwid}]\`, timestamp
            });`;

const newAccNew = `            await db.insert(logs).values({
              id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
              projectId, type: "INFO", message: \`NEW ACCOUNT REGISTERED [\${authIdentifier} - \${hwid}]\`, timestamp,
              username: authIdentifier, hwid: hwid || 'Unknown', ip: ip, clientVersion: req.body.clientVersion || 'Unknown', reason: 'Registered successfully'
            });`;

content = content.replace(newAccOld, newAccNew);

fs.writeFileSync('server.ts', content);
console.log("Patched logs in server.ts");
