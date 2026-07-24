const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const waitCode = `    // Esperar a que el hilo del Tray Icon se inicialice si aún no lo ha hecho
    for (int i = 0; i < 20; i++) {
        if (g_trayHwnd) break;
        Sleep(100);
    }`;

code = code.replace(waitCode, '');

const insertPos = `    std::string accountName = compNameUser; 
    `;

code = code.replace(insertPos, insertPos + '\n' + waitCode + '\n\n');

fs.writeFileSync('src/App.tsx', code);
