const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

content = content.replace('"Welcome! Registered PC successfully."', '\`Bienvenido ${username}, tu equipo con IP ${ip} y HWID ${hwid} ha sido registrado en Onyx Guard. Disfruta del juego.\`');
content = content.replace('"Authentication successful."', 'username ? \`Bienvenido nuevamente ${username}, disfruta del juego.\` : "Authentication successful."');

fs.writeFileSync('server.ts', content);
console.log('Patched');
