const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

const oldMsg1 = '`Bienvenido ${authIdentifier}, tu equipo con IP ${ip} y HWID ${hwid} ha sido registrado en Onyx Guard. Disfruta del juego.`';
const newMsg1 = '`${authIdentifier}, tu equipo ha sido registrado en Onyx Guard. Disfruta del juego.`';

const oldMsg2 = '`Bienvenido nuevamente ${authIdentifier}, disfruta del juego.`';
const newMsg2 = '`Bienvenido nuevamente ${authIdentifier}, disfruta del juego.`'; // It already says this.

if (content.includes(oldMsg1)) {
    content = content.replace(oldMsg1, newMsg1);
    fs.writeFileSync('server.ts', content);
    console.log("Patched server.ts successfully");
} else {
    console.log("Could not find message 1");
}
