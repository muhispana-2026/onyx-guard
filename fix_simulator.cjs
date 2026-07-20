const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/token: securityToken/g, 'secretToken: securityToken');

fs.writeFileSync('src/App.tsx', code);
