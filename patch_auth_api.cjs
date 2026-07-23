const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /if \(conf\.length === 0\) return res\.status\(401\)\.json\(\{ success: false \}\);/g,
  `if (conf.length === 0) return res.status(401).json({ success: false, action: "EXIT", message: "Invalid Security Token or Project Not Found." });`
);

fs.writeFileSync('server.ts', code);
