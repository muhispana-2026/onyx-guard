const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const oldIpCode = `      let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      if (Array.isArray(ip)) ip = ip[0];`;

const newIpCode = `      let ip = req.body.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      if (Array.isArray(ip)) ip = ip[0];`;

content = content.replace(oldIpCode, newIpCode);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts to accept simulated IP");
