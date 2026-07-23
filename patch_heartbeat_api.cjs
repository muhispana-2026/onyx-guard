const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `res.json({ success: true, speedhackSensitivity: conf[0].speedhackSensitivity || "1.80" });`;

code = code.replace(/res\.json\(\{\s*success: true\s*\}\);/g, replacement);

fs.writeFileSync('server.ts', code);
