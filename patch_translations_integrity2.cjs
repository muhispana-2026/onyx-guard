const fs = require('fs');
let code = fs.readFileSync('src/translations.ts', 'utf8');

const descEnStr = `fileIntegrityRulesDesc: "The API evaluates incoming MD5 hash matches against this static checklist. File size and MD5 hash must match exactly.",`;
const descEnRep = `fileIntegrityRulesDesc: "The API evaluates incoming MD5 hash matches against this static checklist. The custom DLL inside the game client automatically scans the files in its directory, calculates the exact MD5 hash and file size, and securely transmits them to the server for verification during the handshake.",`;

const descEsStr = `fileIntegrityRulesDesc: "La API evalúa las sumas de comprobación MD5 entrantes con esta lista estática. El tamaño del archivo y el hash MD5 deben coincidir exactamente.",`;
const descEsRep = `fileIntegrityRulesDesc: "La API evalúa las sumas de comprobación MD5 entrantes con esta lista estática. La DLL dentro del cliente de juego escanea automáticamente los archivos de su carpeta, calcula su hash MD5 y peso exacto (bytes), y los envía de forma segura al servidor para ser verificados durante el inicio de sesión.",`;

code = code.replace(descEnStr, descEnRep);
code = code.replace(descEsStr, descEsRep);

fs.writeFileSync('src/translations.ts', code);
