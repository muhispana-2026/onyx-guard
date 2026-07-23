const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/secretToken: securityToken,\s*secretToken: securityToken/g, "secretToken: securityToken");

fs.writeFileSync('src/App.tsx', code);
