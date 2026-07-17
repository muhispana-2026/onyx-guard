const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const str = `        if (isAllowed) {
          addConsoleLog(language === 'es' ? "🎉 ¡El servidor aceptó el handshake!" : "🎉 Server accepted handshake!");
          addConsoleLog(language === 'es' ? "🚀 Iniciando ventana de main.exe... ¡Proceso de juego activo! ¡A disfrutar!" : "🚀 Launching main.exe window... Game process active! enjoy!");
        } else {`;

const rep = `        if (isAllowed) {
          addConsoleLog(language === 'es' ? \`🎉 ¡El servidor aceptó el handshake! Mensaje: \${rawResponse.message}\` : \`🎉 Server accepted handshake! Message: \${rawResponse.message}\`);
          addConsoleLog(language === 'es' ? "🚀 Iniciando ventana de main.exe... ¡Proceso de juego activo!" : "🚀 Launching main.exe window... Game process active!");
        } else {`;

code = code.replace(str, rep);
fs.writeFileSync('src/App.tsx', code);
