const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  /const conf = await db\.select\(\)\.from\(config\)\.where\(eq\(config\.securityToken, secretToken\)\);/g,
  `console.log("Checking token:", secretToken);
      const conf = await db.select().from(config).where(eq(config.securityToken, secretToken));
      console.log("Conf length:", conf.length);`
);
fs.writeFileSync('server.ts', code);
