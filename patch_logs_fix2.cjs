const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  "      + logs.map(l => `\\${l.timestamp},\\${l.type},\\${l.username},\\${l.status},\\\"\\${l.reason}\\\",\\${l.hwid},\\${l.ip},\\${l.clientVersion}`).join(\"\\n\");",
  "      + logs.map(l => `\\${l.timestamp},\\${l.type},\\${l.username || 'Unknown'},\\${l.status || l.type},\\\"\\${l.reason || l.message}\\\",\\${l.hwid || 'Unknown'},\\${l.ip || 'Unknown'},\\${l.clientVersion || 'Unknown'}`).join(\"\\n\");"
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched download logic");
