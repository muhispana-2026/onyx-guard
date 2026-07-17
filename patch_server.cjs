const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const { username, hwid, ip, clientVersion, fileModified, token } = req.body;",
  "const { username, hwid, ip, clientVersion, fileModified, token, secretToken } = req.body;\n      const actualToken = token || secretToken;"
);

code = code.replace(
  "where('securityToken', '==', token)",
  "where('securityToken', '==', actualToken)"
);

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts!");
