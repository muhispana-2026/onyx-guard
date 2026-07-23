const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace both places where we return CONTINUE.
// Wait, we need to get speedhackSensitivity from the config first!
// We already have `conf[0]` which contains the config record.
// So we can use `conf[0].speedhackSensitivity || "1.80"`.

const replace1 = `return res.json({
            success: true,
            action: "CONTINUE",
            message: \`\${authIdentifier}, tu equipo ha sido registrado en Onyx Guard. Disfruta del juego.\`,
            sessionToken: Math.random().toString(36).substring(2, 15),
            speedhackSensitivity: conf[0].speedhackSensitivity || "1.80"
          });`;

code = code.replace(/return res\.json\(\{\s*success: true,\s*action: "CONTINUE",\s*message: `\$\{authIdentifier\}, tu equipo ha sido registrado en Onyx Guard\. Disfruta del juego\.`,\s*sessionToken: Math\.random\(\)\.toString\(36\)\.substring\(2, 15\)\s*\}\);/g, replace1);

const replace2 = `res.json({
        success: true,
        action: "CONTINUE",
        message: authIdentifier ? \`Bienvenido nuevamente \${authIdentifier}, disfruta del juego.\` : "Authentication successful.",
        sessionToken: Math.random().toString(36).substring(2, 15),
        speedhackSensitivity: conf[0].speedhackSensitivity || "1.80"
      });`;

code = code.replace(/res\.json\(\{\s*success: true,\s*action: "CONTINUE",\s*message: authIdentifier \? `Bienvenido nuevamente \$\{authIdentifier\}, disfruta del juego\.` : "Authentication successful\.",\s*sessionToken: Math\.random\(\)\.toString\(36\)\.substring\(2, 15\)\s*\}\);/g, replace2);

fs.writeFileSync('server.ts', code);
