const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/app\.use\(cors\(\)\);/, 'app.use(cors({ origin: "*" }));');

fs.writeFileSync('server.ts', code);
