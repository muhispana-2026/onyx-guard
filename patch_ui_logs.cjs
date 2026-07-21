const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(/\{log\.username\}/g, '{log.username || "Unknown"}');
content = content.replace(/\{log\.hwid\}/g, '{log.hwid || "Unknown"}');
content = content.replace(/\{log\.ip\}/g, '{log.ip || "Unknown"}');
content = content.replace(/v\{log\.clientVersion\}/g, 'v{log.clientVersion || "Unknown"}');

fs.writeFileSync('src/App.tsx', content);
console.log("Patched UI for logs");
