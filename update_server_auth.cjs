const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const str1 = `          await logEntry("ALLOWED", \`Auto-registered account \${username} with HWID \${hwid}\`);
          return res.json({
            success: true,
            action: "CONTINUE",
            message: "Authorization successful",
            sessionToken: Math.random().toString(36).substring(2, 15)
          });`;

const rep1 = `          await logEntry("ALLOWED", \`Auto-registered account \${username} with HWID \${hwid}\`);
          return res.json({
            success: true,
            action: "CONTINUE",
            message: "Usted ha sido autenticado por Onyx Guard, disfrute del juego",
            sessionToken: Math.random().toString(36).substring(2, 15)
          });`;

const str2 = `      await logEntry("ALLOWED", "Authorization successful");
      res.json({
        success: true,
        action: "CONTINUE",
        message: "Authorization successful",
        sessionToken: Math.random().toString(36).substring(2, 15)
      });`;

const rep2 = `      await logEntry("ALLOWED", "Authorization successful");
      res.json({
        success: true,
        action: "CONTINUE",
        message: "Bienvenido a Onyx Guard",
        sessionToken: Math.random().toString(36).substring(2, 15)
      });`;

code = code.replace(str1, rep1);
code = code.replace(str2, rep2);
fs.writeFileSync('server.ts', code);
