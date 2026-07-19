const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const m = code.match(/app\.post\("\/api\/auth", async \(req, res\) => \{([\s\S]*?)\}\);/);
if (m) console.log(m[1]);
