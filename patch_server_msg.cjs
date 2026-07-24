const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /\$\{authIdentifier\}, tu equipo ha sido registrado en Onyx Guard\. Disfruta del juego\./g,
  `Bienvenido, \${authIdentifier}, tu equipo ha sido registrado en nuestro sistema. Disfrute del juego.`
);

code = code.replace(
  /Bienvenido nuevamente \$\{authIdentifier\}, disfruta del juego\./g,
  `Bienvenido nuevamente \${authIdentifier}, disfrute del juego.`
);

fs.writeFileSync('server.ts', code);
